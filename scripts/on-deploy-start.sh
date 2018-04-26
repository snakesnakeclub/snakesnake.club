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
	\"text\": \"There is a new deploy in process to \`$host\`\",
    \"attachments\": [
        {
            \"fallback\": \"Started deployment of $commit_branch to \`$host\`\",
            \"color\": \"#D99F43\",
            \"author_name\": \"$commit_author\",
            \"title\": \"Visit the commit log\",
            \"title_link\": \"$commit_url\",
			\"footer\": \"Using git branch $commit_branch, commit\n<$commit_url>\",
            \"ts\": $timestamp
        }
    ]
}"
curl -X POST --data-urlencode "payload=$payload" $SLACK_WEBHOOK_URL
