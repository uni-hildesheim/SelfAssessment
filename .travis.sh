#!/usr/bin/env bash

# This script assumes Bash 4 is present (to make use of features such as
# associative arrays).

# supported tasks, meta-level
#
# These are the stages that apply to the whole project (front- and backend),
# yet not all of the subprojects have to implement all the steps.
# If, for example, the backend project does not support the 'lint' step, the
# script will return 0 but not perform any actions.
TASKS=("lint" "build" "install")

TASK=""
for i in "${TASKS[@]}"; do
    if [ "$i" == "$1" ]; then
        TASK="$i"
        echo "[Global] Executing task: $TASK"
        break
    fi
done

if [ -z "$TASK" ]; then
    echo "[Global] Failed to parse task from \$1: $1"
    exit 1
fi

FRONTEND_DIR="SelfAssessment"
BACKEND_DIR="backend"

declare -A FRONTEND_TASKS
declare -A BACKEND_TASKS

FRONTEND_TASKS=(
    ["lint"]="pushd $FRONTEND_DIR; npm run lint; popd;"
    ["build"]="pushd $FRONTEND_DIR; npm run build; popd;"
    ["install"]="pushd $FRONTEND_DIR; npm install; popd;"
)
BACKEND_TASKS=(
    ["install"]="pushd $BACKEND_DIR; npm install; popd;"
)

CHANGED_COMPONENTS=`git diff --name-only HEAD^ | cut -d"/" -f1 | uniq | xargs echo -n`
echo "[Global] Affected components: $CHANGED_COMPONENTS"

# changes which affect neither frontend nor backend (e.g. .travis.yml changes)
# should not be processed, so catch those corner cases here and exit(0).
if [[ $CHANGED_COMPONENTS != *"SelfAssessment"* ]] && \
   [[ $CHANGED_COMPONENTS != *"backend"* ]]; then
    echo "[Global] Neither frontend nor backend are affected, skipping"
    exit 0
fi

FRONTEND_TASK=""
for i in "${!FRONTEND_TASKS[@]}"; do
    if [ "$i" == "$TASK" ]; then
        FRONTEND_TASK="${FRONTEND_TASKS[$i]}"
        echo "[Frontend] Executing task: $TASK"
        break
    fi
done

BACKEND_TASK=""
for i in "${!BACKEND_TASKS[@]}"; do
    if [ "$i" == "$TASK" ]; then
        BACKEND_TASK="${BACKEND_TASKS[$i]}"
        echo "[Backend] Executing task: $TASK"
        break
    fi
done

if [[ $CHANGED_COMPONENTS == *"SelfAssessment"* ]]; then
    if [ "$FRONTEND_TASK" == "" ]; then
        echo "[Frontend] Task $TASK undefined, skipping"
    fi

    echo "[Frontend] Task: \"$FRONTEND_TASK\""
    if ! eval $FRONTEND_TASK; then
        echo "[Frontend] Task $TASK failed"
        exit 1
    fi
fi

if [[ $CHANGED_COMPONENTS == *"backend"* ]]; then
    if [ "$BACKEND_TASK" == "" ]; then
        echo "[Backend] Task $TASK undefined, skipping"
    fi

    echo "[Backend] Task: \"$BACKEND_TASK\""
    if ! eval $BACKEND_TASK; then
        echo "[Backend] Task $TASK failed"
        exit 1
    fi
fi

exit 0
