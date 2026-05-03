using UnityEngine;

/// <summary>
/// Player controller for Leon from the Tomoka Quest protagonist asset sheet.
///
/// Asset notes:
/// - Leon is the blue-haired protagonist swordsman.
/// - The character card presents him as the bright hero-type swordsman.
/// - This script follows the "one character, one file" note by keeping Leon's
///   movement input and animation parameter driving in this single file.
///
/// Expected Animator parameters:
/// - Float MoveX
/// - Float MoveY
/// - Float LastMoveX
/// - Float LastMoveY
/// - Float Speed
/// - Int Direction
/// - Bool IsMoving
/// - Trigger Attack
/// - Trigger Damage
///
/// Direction values:
/// - 0: Down
/// - 1: Up
/// - 2: Left
/// - 3: Right
/// </summary>
[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(Animator))]
public sealed class LeonPlayerController : MonoBehaviour
{
    private static readonly int MoveXHash = Animator.StringToHash("MoveX");
    private static readonly int MoveYHash = Animator.StringToHash("MoveY");
    private static readonly int LastMoveXHash = Animator.StringToHash("LastMoveX");
    private static readonly int LastMoveYHash = Animator.StringToHash("LastMoveY");
    private static readonly int SpeedHash = Animator.StringToHash("Speed");
    private static readonly int DirectionHash = Animator.StringToHash("Direction");
    private static readonly int IsMovingHash = Animator.StringToHash("IsMoving");
    private static readonly int AttackHash = Animator.StringToHash("Attack");
    private static readonly int DamageHash = Animator.StringToHash("Damage");

    [Header("Movement")]
    [SerializeField] private float moveSpeed = 4.5f;

    [Tooltip("Prevents diagonal movement from being faster than cardinal movement.")]
    [SerializeField] private bool normalizeDiagonalInput = true;

    [Header("Combat Animation")]
    [Tooltip("Optional: disables movement briefly while Leon performs a 4-frame attack animation.")]
    [SerializeField] private bool lockMovementDuringAttack = true;

    [Tooltip("Duration should match Leon_Attack_* clips. 4 frames at 12 fps is about 0.333 seconds.")]
    [SerializeField] private float attackLockSeconds = 0.33f;

    [Header("Debug Input")]
    [Tooltip("Press Space to fire the Attack trigger for testing.")]
    [SerializeField] private bool enableSpaceAttack = true;

    [Tooltip("Press H to fire the Damage trigger for testing.")]
    [SerializeField] private bool enableDamageTestKey = true;

    private Rigidbody2D body;
    private Animator animator;
    private Vector2 moveInput;
    private Vector2 lastFacing = Vector2.down;
    private float attackLockTimer;

    private enum FacingDirection
    {
        Down = 0,
        Up = 1,
        Left = 2,
        Right = 3,
    }

    private void Awake()
    {
        body = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();

        body.gravityScale = 0f;
        body.freezeRotation = true;
        PushAnimatorFacing(lastFacing);
    }

    private void Update()
    {
        ReadMovementInput();
        UpdateFacingFromInput();
        UpdateAnimationParameters();
        UpdateDebugAnimationInput();
        TickAttackLock();
    }

    private void FixedUpdate()
    {
        Vector2 velocity = CanMove ? moveInput * moveSpeed : Vector2.zero;
        body.MovePosition(body.position + velocity * Time.fixedDeltaTime);
    }

    /// <summary>
    /// Plays Leon's 4-frame attack animation in the current facing direction.
    /// Hook this to UI buttons, hit boxes, or gameplay systems as needed.
    /// </summary>
    public void PlayAttack()
    {
        animator.ResetTrigger(AttackHash);
        animator.SetTrigger(AttackHash);

        if (lockMovementDuringAttack)
        {
            attackLockTimer = attackLockSeconds;
        }
    }

    /// <summary>
    /// Plays Leon's 2-frame damage animation.
    /// </summary>
    public void PlayDamage()
    {
        animator.ResetTrigger(DamageHash);
        animator.SetTrigger(DamageHash);
    }

    private bool CanMove => attackLockTimer <= 0f;

    private void ReadMovementInput()
    {
        float x = 0f;
        float y = 0f;

        if (Input.GetKey(KeyCode.A)) x -= 1f;
        if (Input.GetKey(KeyCode.D)) x += 1f;
        if (Input.GetKey(KeyCode.S)) y -= 1f;
        if (Input.GetKey(KeyCode.W)) y += 1f;

        moveInput = new Vector2(x, y);

        if (normalizeDiagonalInput && moveInput.sqrMagnitude > 1f)
        {
            moveInput.Normalize();
        }
    }

    private void UpdateFacingFromInput()
    {
        if (moveInput.sqrMagnitude <= 0.001f)
        {
            return;
        }

        // Use the dominant axis so diagonal input still selects one of the
        // four asset-sheet directions: down, up, left, or right.
        if (Mathf.Abs(moveInput.x) > Mathf.Abs(moveInput.y))
        {
            lastFacing = moveInput.x < 0f ? Vector2.left : Vector2.right;
        }
        else
        {
            lastFacing = moveInput.y < 0f ? Vector2.down : Vector2.up;
        }
    }

    private void UpdateAnimationParameters()
    {
        Vector2 animationMove = CanMove ? moveInput : Vector2.zero;
        float speed = animationMove.sqrMagnitude;

        animator.SetFloat(MoveXHash, animationMove.x);
        animator.SetFloat(MoveYHash, animationMove.y);
        animator.SetFloat(SpeedHash, speed);
        animator.SetBool(IsMovingHash, speed > 0.001f);

        PushAnimatorFacing(lastFacing);
    }

    private void PushAnimatorFacing(Vector2 facing)
    {
        animator.SetFloat(LastMoveXHash, facing.x);
        animator.SetFloat(LastMoveYHash, facing.y);
        animator.SetInteger(DirectionHash, ToDirection(facing));
    }

    private int ToDirection(Vector2 facing)
    {
        if (facing == Vector2.up) return (int)FacingDirection.Up;
        if (facing == Vector2.left) return (int)FacingDirection.Left;
        if (facing == Vector2.right) return (int)FacingDirection.Right;
        return (int)FacingDirection.Down;
    }

    private void UpdateDebugAnimationInput()
    {
        if (enableSpaceAttack && Input.GetKeyDown(KeyCode.Space))
        {
            PlayAttack();
        }

        if (enableDamageTestKey && Input.GetKeyDown(KeyCode.H))
        {
            PlayDamage();
        }
    }

    private void TickAttackLock()
    {
        if (attackLockTimer > 0f)
        {
            attackLockTimer -= Time.deltaTime;
        }
    }
}
