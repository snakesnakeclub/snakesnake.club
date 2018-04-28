#!/bin/sh -e
channel="#git"
host="`hostname`"
commit_author=`git log -1 --pretty=format:'%an <%ae>'`
commit_url="`git remote get-url origin`/commit/`git rev-parse HEAD`"
commit_branch=`git rev-parse --abbrev-ref HEAD`
timestamp=`date +%s`
payload="{
    \"channel\": \"$channel\",
    \"mrkdwn\": true,
    \"username\": \"$host\",
	\"text\": \"Successful deploy to \`$host\`\",
    \"attachments\": [
        {
            \"fallback\": \"Successfully deployed $commit_branch to \`$host\`\",
            \"color\": \"#37B787\",
            \"author_name\": \"$commit_author\",
            \"title\": \"Visit the changes live\",
            \"title_link\": \"https://snakesnake.club\",
			\"footer\": \"Using git branch $commit_branch, commit\n<$commit_url>\",
            \"ts\": $timestamp
        }
    ]
}"
curl -X POST --data-urlencode "payload=$payload" $SLACK_WEBHOOK_URL
