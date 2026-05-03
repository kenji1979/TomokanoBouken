using System.IO;
using UnityEditor;
using UnityEditor.Animations;
using UnityEngine;

/// <summary>
/// Optional editor helper that creates a Leon Animator Controller skeleton.
/// Assign the sliced animation clips manually after generation.
/// </summary>
public static class LeonAnimatorControllerBuilder
{
    private const string ControllerPath = "Assets/Animations/Leon/Leon.controller";

    [MenuItem("Tomoka Quest/Leon/Create Animator Controller Skeleton")]
    public static void CreateController()
    {
        Directory.CreateDirectory("Assets/Animations/Leon");

        AnimatorController controller = AnimatorController.CreateAnimatorControllerAtPath(ControllerPath);
        AddParameters(controller);
        AddStateMachineLayout(controller);

        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        EditorUtility.DisplayDialog(
            "Leon Animator",
            "Created Leon.controller skeleton. Assign Leon_Idle/Walk/Attack/Damage clips to the generated states.",
            "OK");
    }

    private static void AddParameters(AnimatorController controller)
    {
        controller.AddParameter("MoveX", AnimatorControllerParameterType.Float);
        controller.AddParameter("MoveY", AnimatorControllerParameterType.Float);
        controller.AddParameter("LastMoveX", AnimatorControllerParameterType.Float);
        controller.AddParameter("LastMoveY", AnimatorControllerParameterType.Float);
        controller.AddParameter("Speed", AnimatorControllerParameterType.Float);
        controller.AddParameter("Direction", AnimatorControllerParameterType.Int);
        controller.AddParameter("IsMoving", AnimatorControllerParameterType.Bool);
        controller.AddParameter("Attack", AnimatorControllerParameterType.Trigger);
        controller.AddParameter("Damage", AnimatorControllerParameterType.Trigger);
    }

    private static void AddStateMachineLayout(AnimatorController controller)
    {
        AnimatorStateMachine root = controller.layers[0].stateMachine;
        root.name = "Leon";

        AnimatorState idleDown = root.AddState("Leon_Idle_Down", new Vector3(260, 60, 0));
        AnimatorState idleUp = root.AddState("Leon_Idle_Up", new Vector3(260, 120, 0));
        AnimatorState idleLeft = root.AddState("Leon_Idle_Left", new Vector3(260, 180, 0));
        AnimatorState idleRight = root.AddState("Leon_Idle_Right", new Vector3(260, 240, 0));

        AnimatorState walkDown = root.AddState("Leon_Walk_Down", new Vector3(520, 60, 0));
        AnimatorState walkUp = root.AddState("Leon_Walk_Up", new Vector3(520, 120, 0));
        AnimatorState walkLeft = root.AddState("Leon_Walk_Left", new Vector3(520, 180, 0));
        AnimatorState walkRight = root.AddState("Leon_Walk_Right", new Vector3(520, 240, 0));

        AnimatorState attackDown = root.AddState("Leon_Attack_Down", new Vector3(800, 60, 0));
        AnimatorState attackUp = root.AddState("Leon_Attack_Up", new Vector3(800, 120, 0));
        AnimatorState attackLeft = root.AddState("Leon_Attack_Left", new Vector3(800, 180, 0));
        AnimatorState attackRight = root.AddState("Leon_Attack_Right", new Vector3(800, 240, 0));

        AnimatorState damageDown = root.AddState("Leon_Damage_Down", new Vector3(1080, 60, 0));
        AnimatorState damageUp = root.AddState("Leon_Damage_Up", new Vector3(1080, 120, 0));
        AnimatorState damageLeft = root.AddState("Leon_Damage_Left", new Vector3(1080, 180, 0));
        AnimatorState damageRight = root.AddState("Leon_Damage_Right", new Vector3(1080, 240, 0));

        root.defaultState = idleDown;

        AddLocomotionAnyStateTransition(root, idleDown, false, 0);
        AddLocomotionAnyStateTransition(root, idleUp, false, 1);
        AddLocomotionAnyStateTransition(root, idleLeft, false, 2);
        AddLocomotionAnyStateTransition(root, idleRight, false, 3);

        AddLocomotionAnyStateTransition(root, walkDown, true, 0);
        AddLocomotionAnyStateTransition(root, walkUp, true, 1);
        AddLocomotionAnyStateTransition(root, walkLeft, true, 2);
        AddLocomotionAnyStateTransition(root, walkRight, true, 3);

        AddDirectionalAnyStateTransition(root, attackDown, "Attack", 0);
        AddDirectionalAnyStateTransition(root, attackUp, "Attack", 1);
        AddDirectionalAnyStateTransition(root, attackLeft, "Attack", 2);
        AddDirectionalAnyStateTransition(root, attackRight, "Attack", 3);

        AddDirectionalAnyStateTransition(root, damageDown, "Damage", 0);
        AddDirectionalAnyStateTransition(root, damageUp, "Damage", 1);
        AddDirectionalAnyStateTransition(root, damageLeft, "Damage", 2);
        AddDirectionalAnyStateTransition(root, damageRight, "Damage", 3);
    }

    private static void AddLocomotionAnyStateTransition(
        AnimatorStateMachine root,
        AnimatorState state,
        bool moving,
        int direction)
    {
        AnimatorStateTransition transition = root.AddAnyStateTransition(state);
        transition.canTransitionToSelf = false;
        transition.hasExitTime = false;
        transition.duration = 0.04f;
        transition.AddCondition(moving ? AnimatorConditionMode.If : AnimatorConditionMode.IfNot, 0, "IsMoving");
        transition.AddCondition(AnimatorConditionMode.Equals, direction, "Direction");
    }

    private static void AddDirectionalAnyStateTransition(
        AnimatorStateMachine root,
        AnimatorState state,
        string trigger,
        int direction)
    {
        AnimatorStateTransition transition = root.AddAnyStateTransition(state);
        transition.hasExitTime = false;
        transition.duration = 0.03f;
        transition.AddCondition(AnimatorConditionMode.If, 0, trigger);
        transition.AddCondition(AnimatorConditionMode.Equals, direction, "Direction");
    }
}
