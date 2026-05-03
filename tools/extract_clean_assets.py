#!/usr/bin/env python3
"""Extract transparent PNG sprites from the Tomoka Quest asset sheet.

The script is intentionally data-driven so each character/monster is cut out
one-by-one from a known rectangle, then the connected background around the
sprite is removed with an alpha channel.

Usage:
    python3 tools/extract_clean_assets.py
    python3 tools/extract_clean_assets.py --source assets/image_17.png

Outputs:
    assets/sprites/heroes/*.png
    assets/sprites/enemies/*.png
    assets/sprites/bosses/*.png
    assets/sprites/effects/*.png
"""

from __future__ import annotations

import argparse
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class SpriteSpec:
    name: str
    rect: tuple[int, int, int, int]
    output: Path
    threshold: int = 34
    padding: int = 2


def default_source() -> Path:
    candidates = [
        ROOT / "assets" / "image_17.png",
        ROOT / "assets" / "clean-edge-asset-sheet.png",
        ROOT / "assets" / "asset-library-clean.png",
        ROOT / "assets" / "asset-library.jpg",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        "No asset sheet found. Put the clean-edge sheet at "
        "assets/image_17.png or assets/clean-edge-asset-sheet.png."
    )


def specs_for_image(size: tuple[int, int]) -> list[SpriteSpec]:
    width, height = size
    if (width, height) == (1024, 896):
        return legacy_asset_library_specs()
    if width >= 900 and height <= 650:
        return clean_edge_sheet_specs()
    raise ValueError(f"Unsupported asset sheet size: {width}x{height}")


def clean_edge_sheet_specs() -> list[SpriteSpec]:
    """Manifest for the 1292x620 clean-edge sheet (`image_17.png`)."""

    h = ROOT / "assets" / "sprites" / "heroes"
    e = ROOT / "assets" / "sprites" / "enemies"
    b = ROOT / "assets" / "sprites" / "bosses"
    fx = ROOT / "assets" / "sprites" / "effects"
    return [
        SpriteSpec("leon", (140, 102, 128, 58), h / "leon.png", 18),
        SpriteSpec("allen", (140, 226, 128, 58), h / "allen.png", 18),
        SpriteSpec("lulu", (140, 360, 128, 58), h / "lulu.png", 18),
        SpriteSpec("tina", (140, 489, 128, 58), h / "tina.png", 18),
        SpriteSpec("slime", (532, 282, 42, 29), e / "slime.png", 14),
        SpriteSpec("shiny_slime", (985, 282, 43, 34), e / "shiny_slime.png", 14),
        SpriteSpec("goblin", (692, 269, 50, 50), e / "goblin.png", 14),
        SpriteSpec("gold_mushroom", (1087, 272, 44, 45), e / "gold_mushroom.png", 14),
        SpriteSpec("mushroom", (612, 276, 42, 39), e / "mushroom.png", 14),
        SpriteSpec("bat", (766, 274, 52, 34), e / "bat.png", 14),
        SpriteSpec("wolf", (838, 268, 50, 46), e / "wolf.png", 14),
        SpriteSpec("golem", (916, 268, 52, 48), e / "golem.png", 14),
        SpriteSpec("ghost", (627, 291, 42, 42), e / "ghost.png", 22),
        SpriteSpec("mimic", (708, 290, 46, 43), e / "mimic.png", 22),
        SpriteSpec("lizard", (532, 346, 42, 45), e / "lizard.png", 22),
        SpriteSpec("bee", (790, 347, 46, 42), e / "bee.png", 22),
        SpriteSpec("cactus", (610, 347, 42, 44), e / "cactus.png", 22),
        SpriteSpec("snowman", (670, 347, 44, 45), e / "snowman.png", 22),
        SpriteSpec("dragon", (708, 347, 46, 43), e / "dragon.png", 22),
        SpriteSpec("knight", (825, 347, 44, 44), e / "knight.png", 22),
        SpriteSpec("mage", (882, 347, 44, 44), e / "mage.png", 22),
        SpriteSpec("crab", (973, 347, 44, 42), e / "crab.png", 22),
        SpriteSpec("doll", (1032, 347, 42, 43), e / "doll.png", 22),
        SpriteSpec("flower", (1088, 347, 44, 43), e / "flower.png", 22),
        SpriteSpec("rare_slime", (977, 275, 52, 48), e / "rare_slime.png", 22),
        SpriteSpec("rare_mushroom", (1085, 275, 56, 48), e / "rare_mushroom.png", 22),
        SpriteSpec("vine_serpent", (529, 88, 118, 78), b / "vine_serpent.png", 26),
        SpriteSpec("magma_golem", (665, 88, 112, 78), b / "magma_golem.png", 26),
        SpriteSpec("aqua_dragon", (805, 86, 120, 82), b / "aqua_dragon.png", 26),
        SpriteSpec("sand_scorpion", (920, 86, 122, 82), b / "sand_scorpion.png", 26),
        SpriteSpec("black_star", (1050, 86, 122, 82), b / "black_star.png", 26),
        SpriteSpec("slash", (1130, 367, 34, 34), fx / "slash.png", 28),
        SpriteSpec("dark_slash", (1172, 367, 34, 34), fx / "dark_slash.png", 28),
        SpriteSpec("burst", (1214, 367, 34, 34), fx / "burst.png", 28),
    ]


def legacy_asset_library_specs() -> list[SpriteSpec]:
    """Manifest for the 1024x896 uploaded asset-library.jpg."""

    h = ROOT / "assets" / "sprites" / "heroes"
    e = ROOT / "assets" / "sprites" / "enemies"
    b = ROOT / "assets" / "sprites" / "bosses"
    fx = ROOT / "assets" / "sprites" / "effects"
    return [
        SpriteSpec("leon", (58, 146, 47, 77), h / "leon.png"),
        SpriteSpec("allen", (302, 146, 48, 78), h / "allen.png"),
        SpriteSpec("lulu", (302, 276, 48, 76), h / "lulu.png"),
        SpriteSpec("tina", (376, 274, 48, 78), h / "tina.png"),
        SpriteSpec("fallen_girl", (302, 406, 52, 78), h / "fallen_girl.png", 22),
        SpriteSpec("dark_hero", (58, 536, 50, 78), h / "dark_hero.png", 18),
        SpriteSpec("boy_adventurer", (58, 646, 49, 72), h / "boy_adventurer.png"),
        SpriteSpec("cool_archer", (58, 766, 48, 74), h / "cool_archer.png", 18),
        SpriteSpec("rose_archer", (304, 764, 52, 76), h / "rose_archer.png"),
        SpriteSpec("slime", (552, 142, 55, 50), e / "slime.png"),
        SpriteSpec("mushroom", (627, 137, 52, 56), e / "mushroom.png"),
        SpriteSpec("goblin", (700, 137, 54, 58), e / "goblin.png"),
        SpriteSpec("bat", (774, 140, 60, 50), e / "bat.png"),
        SpriteSpec("wolf", (850, 137, 52, 58), e / "wolf.png"),
        SpriteSpec("golem", (925, 134, 64, 62), e / "golem.png"),
        SpriteSpec("ghost", (552, 214, 60, 58), e / "ghost.png"),
        SpriteSpec("mimic", (627, 213, 58, 61), e / "mimic.png"),
        SpriteSpec("lizard", (700, 209, 57, 63), e / "lizard.png"),
        SpriteSpec("bee", (775, 214, 63, 54), e / "bee.png"),
        SpriteSpec("cactus", (852, 207, 50, 66), e / "cactus.png"),
        SpriteSpec("snowman", (925, 208, 60, 64), e / "snowman.png"),
        SpriteSpec("dragon", (552, 291, 60, 58), e / "dragon.png"),
        SpriteSpec("knight", (627, 288, 60, 62), e / "knight.png"),
        SpriteSpec("mage", (700, 288, 60, 63), e / "mage.png"),
        SpriteSpec("crab", (777, 289, 62, 58), e / "crab.png"),
        SpriteSpec("doll", (854, 288, 54, 60), e / "doll.png"),
        SpriteSpec("flower", (927, 289, 62, 58), e / "flower.png"),
        SpriteSpec("rare_slime", (568, 399, 50, 50), e / "rare_slime.png"),
        SpriteSpec("rare_mushroom", (714, 399, 52, 50), e / "rare_mushroom.png"),
        SpriteSpec("rare_rabbit", (864, 396, 50, 55), e / "rare_rabbit.png"),
        SpriteSpec("vine_serpent", (548, 492, 148, 86), b / "vine_serpent.png", 38),
        SpriteSpec("magma_golem", (706, 497, 152, 86), b / "magma_golem.png", 38),
        SpriteSpec("aqua_dragon", (866, 497, 137, 84), b / "aqua_dragon.png", 38),
        SpriteSpec("sand_scorpion", (558, 630, 150, 70), b / "sand_scorpion.png", 38),
        SpriteSpec("black_star", (558, 754, 132, 78), b / "black_star.png", 38),
        SpriteSpec("slash", (834, 812, 48, 54), fx / "slash.png", 42),
        SpriteSpec("dark_slash", (890, 812, 48, 54), fx / "dark_slash.png", 42),
        SpriteSpec("burst", (947, 812, 48, 54), fx / "burst.png", 42),
    ]


def color_distance(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def remove_connected_background(image: Image.Image, threshold: int) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    # Use the crop corners as the background reference. Some character crops are
    # tight enough that their dark outline touches an edge, so sampling the full
    # edge can accidentally classify black armor/cloaks as background.
    corner_samples: list[tuple[int, int, int, int]] = [
        pixels[0, 0],
        pixels[width - 1, 0],
        pixels[0, height - 1],
        pixels[width - 1, height - 1],
    ]

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    def is_background(pixel: tuple[int, int, int, int]) -> bool:
        return any(color_distance(pixel, sample) <= threshold for sample in corner_samples)

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue
        visited.add((x, y))
        if not is_background(pixels[x, y]):
            continue
        pixels[x, y] = (pixels[x, y][0], pixels[x, y][1], pixels[x, y][2], 0)
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return trim_transparent(rgba)


def trim_transparent(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        return image
    return image.crop(bbox)


def extract(source: Path, specs: Iterable[SpriteSpec]) -> list[Path]:
    sheet = Image.open(source).convert("RGBA")
    written: list[Path] = []
    for spec in specs:
        x, y, w, h = spec.rect
        crop = sheet.crop((x, y, x + w, y + h))
        transparent = remove_connected_background(crop, spec.threshold)
        if spec.padding:
            padded = Image.new(
                "RGBA",
                (transparent.width + spec.padding * 2, transparent.height + spec.padding * 2),
                (0, 0, 0, 0),
            )
            padded.alpha_composite(transparent, (spec.padding, spec.padding))
            transparent = padded
        spec.output.parent.mkdir(parents=True, exist_ok=True)
        transparent.save(spec.output)
        written.append(spec.output)
    return written


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=None)
    args = parser.parse_args()

    source = (args.source or default_source()).resolve()
    sheet = Image.open(source)
    specs = specs_for_image(sheet.size)
    written = extract(source, specs)
    print(f"Source: {source.relative_to(ROOT)} ({sheet.width}x{sheet.height})")
    print(f"Wrote {len(written)} transparent sprites:")
    for path in written:
        print(f"  {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
