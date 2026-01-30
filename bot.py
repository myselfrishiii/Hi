
import asyncio
import discord
from discord.ext import commands
from google import genai
import base64
import os
import shutil

# ==========================================================
# CONFIGURATION - REPLACE THESE WITH YOUR ACTUAL TOKENS
# ==========================================================
DISCORD_TOKEN = 'YOUR_DISCORD_BOT_TOKEN_HERE'
GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'
# ==========================================================

# 1. Setup Discord Bot
# We need 'message_content' to read commands like !speak
# We need 'voice_states' to know when someone joins/leaves VC
intents = discord.Intents.default()
intents.message_content = True
intents.voice_states = True
bot = commands.Bot(command_prefix='!', intents=intents)

# 2. Setup Gemini Client (Python SDK)
client = genai.Client(api_key=GEMINI_API_KEY, http_options={'api_version': 'v1alpha'})

def check_ffmpeg():
    """Checks if FFmpeg is available on the hosting environment."""
    return shutil.which("ffmpeg") is not None

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user} (ID: {bot.user.id})')
    print('------')
    if check_ffmpeg():
        print("✅ FFmpeg detected successfully!")
    else:
        print("❌ CRITICAL WARNING: FFmpeg was NOT found. Voice playback will fail.")
        print("Hosting Note: Ensure your 'bot-hosting.net' plan supports FFmpeg (usually default in Python images).")
    print('Bot is online. Commands: !join, !speak [text], !leave')

@bot.command()
async def join(ctx):
    """Joins the user's current voice channel."""
    if ctx.author.voice:
        channel = ctx.author.voice.channel
        if ctx.voice_client is not None:
            return await ctx.voice_client.move_to(channel)
        await channel.connect()
        await ctx.send(f"🎙️ Joined **{channel.name}**! Use `!speak [message]` to make me talk.")
    else:
        await ctx.send("⚠️ You need to be in a voice channel first!")

@bot.command()
async def speak(ctx, *, message: str):
    """Converts text to speech using Gemini and plays it in the Voice Channel."""
    if not ctx.voice_client:
        if ctx.author.voice:
            await ctx.invoke(join)
        else:
            return await ctx.send("⚠️ I'm not in a voice channel. Join one first!")

    # Stop current audio if playing to prevent overlap
    if ctx.voice_client.is_playing():
        ctx.voice_client.stop()

    async with ctx.typing():
        try:
            # Generate Audio using Gemini TTS model
            # gemini-2.5-flash-preview-tts provides high-quality natural speech
            response = client.models.generate_content(
                model='gemini-2.5-flash-preview-tts',
                contents=message,
                config={
                    'response_modalities': ['AUDIO'],
                    'speech_config': {
                        'voice_config': {'prebuilt_voice_config': {'voice_name': 'Puck'}}
                    }
                }
            )

            # Extract the raw audio bytes (base64) from the response
            audio_part = next((part for part in response.candidates[0].content.parts if part.inline_data), None)
            
            if not audio_part:
                return await ctx.send("❌ Gemini didn't return any audio. The response might have been blocked.")

            audio_bytes = base64.b64decode(audio_part.inline_data.data)

            # Save to a temporary file unique to this server
            filename = f"speech_{ctx.guild.id}.mp3"
            with open(filename, "wb") as f:
                f.write(audio_bytes)

            # Final check for FFmpeg before attempting playback
            if not check_ffmpeg():
                return await ctx.send("❌ Error: FFmpeg is missing on the host. Audio cannot be played.")

            # Create audio source and play
            source = discord.FFmpegPCMAudio(filename)
            ctx.voice_client.play(source, after=lambda e: print(f'Player error: {e}') if e else None)
            
            await ctx.send(f"🗣️ **Gemini:** {message}")

        except Exception as e:
            await ctx.send(f"❌ **Technical Error:** {str(e)}")
            print(f"Error in !speak: {e}")

@bot.command()
async def leave(ctx):
    """Disconnects the bot from voice."""
    if ctx.voice_client:
        await ctx.voice_client.disconnect()
        await ctx.send("👋 Disconnected. See you later!")
    else:
        await ctx.send("I'm not in a voice channel.")

if __name__ == "__main__":
    if DISCORD_TOKEN in ['YOUR_DISCORD_BOT_TOKEN_HERE', 'YOUR_DISCORD_BOT_TOKEN']:
        print("❌ ERROR: You must edit 'bot.py' and replace 'YOUR_DISCORD_BOT_TOKEN_HERE' with your real bot token.")
    elif GEMINI_API_KEY in ['YOUR_GEMINI_API_KEY_HERE', 'YOUR_GEMINI_API_KEY']:
        print("❌ ERROR: You must edit 'bot.py' and replace 'YOUR_GEMINI_API_KEY_HERE' with your real API key.")
    else:
        bot.run(DISCORD_TOKEN)
