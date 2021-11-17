import { execSync } from 'child_process';

const gitCommand = 'git rev-parse HEAD';

export default function getGitCommitHash() {
  return execSync(gitCommand).toString().trim();
}