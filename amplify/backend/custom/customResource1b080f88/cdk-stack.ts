import * as cdk from "aws-cdk-lib";
import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import * as backup from "aws-cdk-lib/aws-backup";
import * as kms from "aws-cdk-lib/aws-kms";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });

    // update with your username before running amplify push. This must be the same principal that is setup for your amplify profile
    // if you are using a federated role, change the code to load that role by name instead of loading a user
    // const keyAdmin = iam.User.fromUserName(this, "keyAdmin", "amplify-backup");
    const keyAdmin = iam.User.fromUserName(
      this,
      "keyAdmin",
      // `amplify-backup-${AmplifyHelpers.getProjectInfo().envName}`
      "amplify-cloud-kintai-user"
    );

    const root = new iam.AccountRootPrincipal();
    // The BackupAdminRole can below assumed principals in your account for which you give the right to assume them
    // via STS assume role. You'll need to adjust the assumedBy principals to reference roles or users in your account
    // and this role can then administer restore points
    const backupAdmin = new iam.Role(this, "BackupAdminRole", {
      assumedBy: new iam.AccountPrincipal(cdk.Stack.of(this).account),
    });
    backupAdmin.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSBackupFullAccess")
    );

    const { envName } = AmplifyHelpers.getProjectInfo();
    const roleName = "amplifyconsole-backend-role";
    const keyRole = iam.Role.fromRoleName(this, "RunUser", roleName);

    const key = new kms.Key(
      this,
      `amplify-appsync-${AmplifyHelpers.getProjectInfo().envName}-key`,
      {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        alias: `alias/amplify-appsync-${
          AmplifyHelpers.getProjectInfo().envName
        }-key`,
        description:
          "KMS key for encrypting the objects in your AWS Backup Vault",
        enableKeyRotation: false,
        admins: [backupAdmin, keyAdmin, root],
        policy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["kms:*"],
              principals: [keyAdmin, root],
              resources: ["*"],
            }),
            new iam.PolicyStatement({
              actions: [
                "kms:Create*",
                "kms:Describe*",
                "kms:Enable*",
                "kms:List*",
                "kms:Put*",
                "kms:Update*",
                "kms:Revoke*",
                "kms:Disable*",
                "kms:Get*",
                "kms:Delete*",
                "kms:ScheduleKeyDeletion",
                "kms:CancelKeyDeletion",
              ],
              principals: [keyRole],
              resources: ["*"],
            }),
            new iam.PolicyStatement({
              actions: [
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*",
                "kms:DescribeKey",
              ],
              principals: [backupAdmin],
              resources: ["*"],
            }),
          ],
        }),
      }
    );

    const plan = new backup.BackupPlan(this, "amplify-appsync-dyanmodb-plan", {
      backupPlanName: `amplify-appsync-dyanmodb-plan-${cdk.Fn.ref("env")}`,
      backupPlanRules: [
        backup.BackupPlanRule.daily(),
        backup.BackupPlanRule.weekly(),
        backup.BackupPlanRule.monthly1Year(),
      ],
      backupVault: new backup.BackupVault(this, "Vault", {
        backupVaultName: `amplify-appsync-dyanmodb-valut${
          AmplifyHelpers.getProjectInfo().envName
        }`,
        encryptionKey: key,
        accessPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.DENY,
              principals: [new iam.AnyPrincipal()],
              actions: ["backup:DeleteRecoveryPoint"],
              resources: ["*"],
              conditions: {
                StringNotLike: {
                  "aws:PrincipalArn": [backupAdmin.roleArn],
                },
              },
            }),
          ],
        }),
      }),
    });

    plan.addSelection(`UserStackSelectionByTag`, {
      resources: [
        backup.BackupResource.fromTag("user:Stack", cdk.Fn.ref("env")),
      ],
    });
  }
}
