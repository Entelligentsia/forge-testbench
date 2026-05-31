#!/usr/bin/env python3
"""hello — minimal CLI greeter."""
from __future__ import annotations
import click


@click.command()
@click.argument("name")
@click.option("--count", "-n", default=1, help="Number of greetings.")
@click.option("--shout", is_flag=True, help="SHOUT the greeting.")
@click.option("--formal", is_flag=True, help="Use a formal greeting.")
def main(name: str, count: int, shout: bool, formal: bool) -> None:
    """Greet NAME."""
    greeting = f"Greetings, {name}" if formal else f"Hello, {name}!"
    if shout:
        greeting = greeting.upper()
    for _ in range(count):
        click.echo(greeting)


if __name__ == "__main__":
    main()
