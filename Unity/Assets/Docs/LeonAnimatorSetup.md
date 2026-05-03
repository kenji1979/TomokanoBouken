# Leon Animator Setup

This document describes how to set up the Unity Animator for Leon from
`image_17.png` / the submitted asset sheet.

## Character note

Leon is the blue-haired protagonist in the left-side `PROTAGONISTS` section.
The Japanese card describes him as an ikemen swordsman protagonist with a
blue-and-red silhouette and heroic sword style. The sheet also notes a
`1 character = 1 file` approach, so Leon-specific movement and animation logic
is kept in:

```text
Assets/Scripts/Leon/LeonPlayerController.cs
```

## Sprite slicing

Import the asset sheet into Unity, then slice Leon's sprites from his card.
Use `Point (no filter)` for pixel-art style assets.

Expected Leon clips:

| Clip | Direction | Frames |
| --- | --- | --- |
| `Leon_Idle_Down` | Down | 4 |
| `Leon_Idle_Up` | Up | 4 |
| `Leon_Idle_Left` | Left | 4 |
| `Leon_Idle_Right` | Right | 4 |
| `Leon_Walk_Down` | Down | 4 |
| `Leon_Walk_Up` | Up | 4 |
| `Leon_Walk_Left` | Left | 4 |
| `Leon_Walk_Right` | Right | 4 |
| `Leon_Attack_Down` | Down | 4 |
| `Leon_Attack_Up` | Up | 4 |
| `Leon_Attack_Left` | Left | 4 |
| `Leon_Attack_Right` | Right | 4 |
| `Leon_Damage_Down` | Down | 2 |
| `Leon_Damage_Up` | Up | 2 |
| `Leon_Damage_Left` | Left | 2 |
| `Leon_Damage_Right` | Right | 2 |

Walk frame order should be `1 -> 2 -> 3 -> 4`.

## Animator parameters

Create these Animator parameters exactly:

| Name | Type | Purpose |
| --- | --- | --- |
| `MoveX` | Float | Current horizontal input |
| `MoveY` | Float | Current vertical input |
| `LastMoveX` | Float | Last non-zero facing X |
| `LastMoveY` | Float | Last non-zero facing Y |
| `Speed` | Float | Movement speed magnitude |
| `Direction` | Int | `0=Down`, `1=Up`, `2=Left`, `3=Right` |
| `IsMoving` | Bool | True when WASD input is active |
| `Attack` | Trigger | Plays 4-frame attack clip |
| `Damage` | Trigger | Plays 2-frame damage clip |

## Recommended Animator structure

Use three blend trees or state groups:

1. `Idle`
   - Select idle clip by `Direction`.
2. `Walk`
   - Select walk clip by `Direction`.
   - Transition from `Idle` when `IsMoving == true`.
   - Transition back when `IsMoving == false`.
3. `Attack`
   - Any State -> directional attack state on `Attack`.
   - Direction is selected by `Direction`.
   - Disable `Has Exit Time` only if you script the transition duration manually;
     otherwise keep exit time so all 4 frames play.
4. `Damage`
   - Any State -> directional damage state on `Damage`.
   - Direction is selected by `Direction`.
   - Keep exit time so both frames play.

## Optional Animator Controller generator

If the clips are already named as listed above, use:

```text
Tools > Tomoka Quest > Leon > Create Animator Controller
```

This editor utility creates:

```text
Assets/Animations/Leon/Leon.controller
```

and wires the parameters/states/transitions for the 4-direction idle, walk,
attack, and damage clips. Missing clips are left as empty states so they can be
assigned manually.

## Player GameObject setup

Create a `Leon` GameObject with:

- `SpriteRenderer`
- `Rigidbody2D`
  - Gravity Scale: `0`
  - Freeze Rotation Z: enabled
- `Animator`
  - Controller: Leon Animator Controller
- `LeonPlayerController`

The script reads WASD by default and updates all Animator parameters.

