# Set up our Authorization Server

## Requirements:
* Outlook account

## Steps
1. Sign in with your outlook account
2. Go to [Azure Portal](https://portal.azure.com/)
3. Clic on **Azure Active Directory** ![Step1](images/azure/1-step.jpg)
4. Create an App Registration ![Step2](images/azure/2-step.jpg)
5. Register an application: Add Name, target audiences and the redirec URI(`AZURE_REDIRECT_URL`) ![Step3](images/azure/3-step.png)
6. Get your credentials(`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`) and look the available endpoints. Then clic on `API permissions` ![Step4](images/azure/4-step.jpg)
7. Set the API scope(`AZURE_SCOPE`). By default the `User.Read` permission is created and it's enought for this example. ![Step5](images/azure/5-step.jpg)
8. Create a `New client secret` ![Step6](images/azure/6-step.jpg)
9. Copy the secret to your `AZURE_CLIENT_SECRET` ENV variable ![Step6.1](images/azure/6.1-step.jpg)