$ver_num_str = Get-Content ver.txt
$ver_num = [System.Decimal]::Parse($ver_num_str)
$ver_num++
Set-Content ver.txt $ver_num
Write-Output "Setting current version to $ver_num"

Write-Output "Building Docker image..."
docker build . -t gamma-onboarding-vue

docker tag gamma-onboarding-vue:latest "kevinmcgrath/gamma-onboarding-vue:latest"
docker tag gamma-onboarding-vue:latest "kevinmcgrath/gamma-onboarding-vue:v$ver_num"

Write-Output "Pushing images to Dockerhub..."
docker push "kevinmcgrath/gamma-onboarding-vue:latest"
docker push "kevinmcgrath/gamma-onboarding-vue:v$ver_num"

Write-Output "Done!"