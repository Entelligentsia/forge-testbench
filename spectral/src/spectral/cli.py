import click
from rich.console import Console
from rich.panel import Panel
from spectral.moods import MOODS
from spectral.engine import SoundEngine

console = Console()

@click.group()
@click.version_option()
def main():
    """Spectral: ambient soundscapes from mood keywords."""

@main.command()
@click.argument("mood", type=click.Choice(list(MOODS.keys()), case_sensitive=False))
@click.option("--duration", "-d", default=0, help="Seconds to play (0 = infinite)")
@click.option("--bpm", default=None, type=int, help="Override base tempo")
def play(mood: str, duration: int, bpm: int | None):
    """Play a soundscape matching MOOD."""
    profile = MOODS[mood]
    if bpm:
        profile = {**profile, "bpm": bpm}
    console.print(Panel(f"[bold]{mood.upper()}[/bold]\n{profile['description']}", title="spectral"))
    engine = SoundEngine(profile)
    engine.run(duration or None)

@main.command()
def moods():
    """List available mood profiles."""
    from rich.table import Table
    t = Table(title="Mood Profiles")
    t.add_column("Mood", style="cyan")
    t.add_column("BPM")
    t.add_column("Description")
    for name, p in MOODS.items():
        t.add_row(name, str(p["bpm"]), p["description"])
    console.print(t)
