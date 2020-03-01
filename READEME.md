//1. Utworzenie nowego planu premium
 az appservice plan create \
  --resource-group premium_plan_group \
  --name premium_plan \
  --sku S1
  
//2. Utworzenie webapp na planie premium
 az webapp create \
  --resource-group premium_plan_group \
  --name applicationPremium \
  --plan premium_plan \
  --runtime "node|10.15"
  
//3. Utworzenie deployment slotu
 az webapp deployment slot create \
 --name applicationPremium  \
 --resource-group premium_plan_group \
 --slot premiumSlot
 
//4. Zmiana pliku azure.yml 

on:
  push:
    branches:
      - deploy

env:
  AZURE_WEBAPP_NAME: applicationPremium/premiumSlot
  AZURE_WEBAPP_PACKAGE_PATH: '.'
  NODE_VERSION: '10.15'

jobs:
  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ env.NODE_VERSION }}
    - name: Install dependencies
      run: |
        npm install
    - name: 'Deploy to Azure WebApp'
      uses: azure/webapps-deploy@v1
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
		

//5. Git push by kopnąć workflow do wdrożenia aplikacji na slot.
