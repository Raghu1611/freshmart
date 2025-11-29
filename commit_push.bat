@echo off
echo STARTING GIT OPERATIONS > git_log.txt
echo. >> git_log.txt
echo --- GIT STATUS --- >> git_log.txt
git status >> git_log.txt 2>&1
echo. >> git_log.txt
echo --- GIT ADD --- >> git_log.txt
git add . >> git_log.txt 2>&1
echo. >> git_log.txt
echo --- GIT COMMIT --- >> git_log.txt
git commit -m "Fix Vercel deployment config and server startup" >> git_log.txt 2>&1
echo. >> git_log.txt
echo --- GIT PUSH --- >> git_log.txt
git push origin main >> git_log.txt 2>&1
echo. >> git_log.txt
echo DONE >> git_log.txt
