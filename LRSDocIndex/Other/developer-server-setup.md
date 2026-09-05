# Developer Server Setup

| Field | Value |
| --- | --- |
| **Doc** | 735 · Other · Enterprise |
| **Product** | Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [GDB-DeveloperServerSetup-290121-1539-7.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/GDB-DeveloperServerSetup-290121-1539-7.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | server setup · enterprise configuration · debug setup · certificate management · unit test data · database restore · publishing |
| **Tools** | Enterprise Builder · ArcGIS Server · Portal for ArcGIS · ArcGIS Data Store · ArcGIS Web Adaptor |

## Summary

Instructions for setting up and configuring an ArcGIS Enterprise server environment for development purposes. Covers cleanup, installation using Enterprise Builder, configuration wizard steps, debugging setup, common problems and solutions, certificate management, and publishing C++ unit test data.

## Related documents

<!-- related:begin -->
- [Developer Server Setup Notes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/developer-server-setup-notes.md>) — similar text 0.10 · 3 title words · 3 filename words · same kind/folder <!-- rel:734 s=4.997 -->
- [Notes for Experience Builder Setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/notes-for-exb-setup.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/folder <!-- rel:477 s=2.47 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/complete-dmz-machine-setup.md>) — similar text 0.11 · 1 title word · 1 filename word · same surface <!-- rel:632 s=2.321 -->
- [Unfederating ArcGIS Server when all else fails](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unfederating-arcgis-server-when-all-else-fails.md>) — similar text 0.13 · 1 title word · 1 filename word · same kind <!-- rel:898 s=2.233 -->
- [ArcGIS Pipeline Referencing Server FAQ](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/674-arcgis-apr-server-faq.md>) — similar text 0.10 · 1 title word · same kind <!-- rel:396 s=1.628 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Enterprise Builder](https://www.google.com/search?q=%22Enterprise%20Builder%22+site%3Adoc.esri.com) · [ArcGIS Server](https://www.google.com/search?q=%22ArcGIS%20Server%22+site%3Adoc.esri.com) · [Portal for ArcGIS](https://www.google.com/search?q=%22Portal%20for%20ArcGIS%22+site%3Adoc.esri.com) · [ArcGIS Data Store](https://www.google.com/search?q=%22ArcGIS%20Data%20Store%22+site%3Adoc.esri.com) · [ArcGIS Web Adaptor](https://www.google.com/search?q=%22ArcGIS%20Web%20Adaptor%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Developer Server Setup
Be aware that on a slower desktop machine, this entire process can take upwards of five hours.

Cleanup server machine (30 minutes)
        Uninstall the following apps by uninstalling Enterprise Builder or manually one by one:

                ArcGIS Server
                Portal for ArcGIS
                ArcGIS Data Store
                ArcGIS Web Adaptor - portal
                ArcGIS Web Adaptor - server
        Delete anything inside C:\ArcGIS except C:\ArcGIS\framework\runtime (skeleton folder structure that X:\ArcGIS is pointing to)
        Delete:

%ProgramData%\ArcGISBuilder10.9 c:\inetpub\wwwroot\server c:\inetpub\wwwroot\portal

Run enterprise builder (1 hour)
        Find a working server build number (#####)

                 Go to http://utilitynetwork.esri.com/ and find a working server build number.
                 You can check the sanity status of enterprise builder here: \\metro\ArcGIS_Enterprise10.9\README_BEFORE_INSTALLING.
                 html
        Go to the following folder and run setup (Builder.exe).

         \\archive2\10DevSetups\EnterpriseBuilder\#####

Note: If the EnterpriseBuilder setup complains about web adapters (or the Portal and Server sites), use the IIS Manager and navigate to Sites in the tree view. The portal and server sites can be deleted via a right click Deploy > Delete Folder and Contents.
        Destination folder: C:\ArcGIS
User name: admin, Password: esri.agp.108 (Note: esri.agp doesn't work) Note: You can use any user name and password. If you plan to publish unit test data, admin is recommended. Note: If the user is already existing (from previous installation for example), make sure that it has administrative privilege. Enterprise builder does not check for that and will silently fail.
        Use .ecp file for authorization.

           \\metro\released\Authorization_Files\Version10.9\ArcGIS_Server\Advanced\Server_Ent_Adv.ecp

        Click 'Next' and 'Install'.
        Reboot machine. ( If you miss this step, I bet you'll waste 3 hours.)

ArcGIS Enterprise Configuration Wizard (30 minutes)
        Open the configuration webpage. Click ADVANCE. Proceed to localhost.

                https://localhost:6443/arcgis/enterprise/
        Use a .json file for Portal licensing (e.g., for 10.9).

           \\metro\Released\Authorization_Files\Version10.9\Portal_for_ArcGIS_10.9\AllUTs_AllAddOnApps.json

           Note that old license files are maintained in this folder.

           \\metro\Released\Authorization_Files\Version10.9\Portal_for_ArcGIS_10.9\Old

           You need to use a compatible license file to avoid potential failures of setting up server.

           Compatible_with_Build12660to12678
           Compatible_with_Build12680to12723
           ...

        User name/password: admin/esri.agp.108
        User type license: GIS Professional Advanced
        Fill in name, email, etc
        Next, Next, Finish
If you encounter https related error from the verification step, it is because your machine's IIS has no https enabled. Follow the instructions described on the error message.

Configure machine for debug (20 minutes)
        Map X: to C:\ArcGIS\framework\runtime if you don't have X: drive. (Windows command line: subst x: C:
        \ArcGIS\framework\runtime)
         Create a new text file and name it with set-x-drive.reg
         Copy and paste the following and run it.

         Windows Registry Editor Version 5.00

         [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\DOS Devices]
         "X:"="\\??\\C:\\ArcGIS\\framework\\runtime"

         Restart machine.
Stop ArcGIS Server (ArcGIS Data Store and Portal for ArcGIS can remain running). Look at Task Manager, kill any running ArcSOC.exe processes.
         Rename the X:\ArcGIS to X:\ArcGIS_old folder.
         Get code from the ArcGIS Repo in git bash window (will not work in Windows command window).

         git clone https://devtopia.esri.com/ArcGISPro/ArcGISPro.git 'X:\ArcGIS'

         Note: If you see authentication failed message, run it again.
Note: If you get a fatal error multiple updates for ref 'XXXX' - Removing the following from the .gitconfig seemed to do the trick, but I am not sure why:
[remote "origin"] fetch = +refs/heads/*:refs/remotes/origin/*

         Move all folders inside X:\ArcGIS_old into X:\ArcGIS.
         Delete ArcGIS_old folder.
Get build. You're pulling release DLLs. Open the following file and edit build number. You can either specify "Debug" or "Release" for buildTarget depending on your purpose.

X:\ArcGIS\SharedArcGIS\Build\GetBuildScripts\GetProServerBuild_Settings.xml buildNumber = "25972" buildTarget = "Debug"

         Note: You can pull debug DLLs as well. Confirmed you can publish with debug DLLs.
         Create a new bat file.

         X:\ArcGIS\SharedArcGIS\Build\GetBuildScripts\GetBuildServer.bat

         Copy and paste the following script into the bat file.

           net stop "ArcGIS Server"

           X:
cd X:\ArcGIS\SharedArcGIS\Build\GetBuildScripts powershell -ExecutionPolicy ByPass -File GetProServerBuild.ps1 -SettingsFile GetProServerBuild_Settings.
           xml

net start "ArcGIS Server" pause

         Run the batch file as admin. If it's asking something, input 'a'. The machine is ready to publish.
NOTE1: On a new server, you will waste a lot of time trying to publish if you do not create a unadmin user (with GIS Professional Advanced credentials).
NOTE2: You must log in once as the unadmin user; otherwise, when you attempt to publish with Hussein's publishing web site (un.esri.com), the dialog to prompt a security question will be left hanging on the backend, thus timing out the publishing. Once you complete the initial login,
         Hussein's publishing web site can then be used successfully.
         For next refreshing get build, update the buildNumber in GetProServerBuild_Settings.xml and run the bat as admin.

Problems and solutions
While running the get build batch file, I've realized that 'red' characters are showing. It says "Program 'RegTypeLib.exe' failed to run: The specified executable is not a valid application for this OS platform.". If you encounter this problem:

Check the size of X:\ArcGIS\SharedArcGIS\DepFilesWin64\ArcGIS\RegTypeLib.exe. If it is 1KB, the git lfs didn't download those binary files correctly.
You need to rename X:\ArcGIS to X:\ArcGIS_old, run git lfs command again, and move (i.e., overwrite) the files in X:\ArcGIS to X:\ArcGIS_old, delete X:\ArcGIS, and rename X:\ArcGIS_old to X:\ArcGIS.

Temporary item to do until 10.8 release when publishing fails
         Symptom: Publishing tools GP service does not start with "Error: java.lang.NoClassDefFoundError: com/esri/arcgis/gae/gp
         /GeoAnalyticsFunctionFactory"
         Delete the geoanalytics extension JAR located in your server ArcGIS\framework\lib\ext\arcgis-geoanalytics-ext.jar
         ArcGIS\framework\runtime\ArcGIS\framework\lib\ext). Then restart your server.
How to get rid of server certificate check box
If you see a certificate message box whenever you open a Pro project, do this:

        Go to server machine.
        Copy esri.pfx file from this directory to your local folder (e.g., C:\Temp).

              \\esri.com\departments\Development\Geodatabase\Orion\Public\Tools\portal

        Open Internet Information Services (type iis on Windows menu)
        Double click "Server Certificates".
        If there is any existing certificate (e.g., domainCert), delete them.
        Actions, Import... select the copied esri.pfx file. Password is "esri.com". Click OK.
        Click Connections and your server on the left panel. Sites. Click "Default Web Site"
        Actions, Bindings... Select https and Edit.
        Select SSL certificate with Esri_Wildcard. OK, Close.
        Click Connections and your server on the left panel. Actions, Restart

How to prepare C++ unit test data for publishing
        Run up to the following line in the TestDataPreparer::SetUp() method using break point.

        TestUtil::RecreateDefaultUtilityNetworkGDBWithDataLoadedAndIndexCreated();

        Copy the "UtilityNetworkGDB.BAK" database backup file to your database server machine.

        C:\QATest11\NativeGeodatabaseTests\UtilityNetworkTests\UtilityNetworkTests\TestData

        Go to your database server machine and open SQL Server Studio.
        Note that you cannot restore database from remote machine. You have to work in the machine.
        Right click 'Databases' and click 'Restore Database...".
        Restore database using the BAK file.
        Drag and drop the 'SynchLoginsScript.sql' file in the following folder into SQL Server studio.
        Click '! Execute'.

        \\esri.com\departments\Development\Geodatabase\Orion\Development\Esri_Tools\SynchLoginsScript

        Now you can publish UN in the database using a database connection with test/test.

How to publish C++ unit test data
        Open pro. Add UN to map with relevant data sources together.
        Connect a portal that you want to publish against (as an admin or publisher)
        Click "Share" tab
        Click "Web Layer" button
        Put Name, Summary, Tags with the same string (e.g., "UnitTests")
        Check Feature
Go to Configuration tab, check Version Management (if you don't see "Version Management" your dataset is either not registered or is using traditional versioning instead of branch versioning - can be changed in the Geodatabase Connection Properties)
        Click Analyze
        Errors will be shown, select 'first' error, right click, register dataset.
        Put the same string (e.g., "UnitTests")
        Click analyze again. Make sure no error.
        Click Publish
