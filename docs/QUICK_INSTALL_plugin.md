# Quick Installation Guide for the Synthdata Plugin

A guide for installing the Synthdata plugin for the i2b2 webclient 1.8.x.

## Installing the Plugin

### Prerequisites

 - i2b2 Web Client 1.8.x Release.
 - System administrator privileges for updating the Web Client.

#### 1. Add the Plugin to the i2b2 Webclient

- Copy the folder **synth-data** from the project directory ***synth-data/plugin/webclient-1.8.x/edu/pitt/dbmi*** to the following i2b2 webclient plugin directory:

    ```
    /var/www/html/webclient/plugins/edu/pitt/dbmi
    ```

    Note that the path **edu/pitt/dbmi** may not exist in the directory path **/var/www/html/webclient/plugins**.  You can create it by execute the command ```mkdir -p edu/pitt/dbmi``` in the directory **/var/www/html/webclient/plugins**.

- Add the following content to the file ***plugins.json*** located in the directory ```/var/www/html/webclient/plugins```:

    ```
    "edu.pitt.dbmi.synth-data"
    ```

#### 2. Configuring the Plugin

To set the synthdata REST API URL, modify the file ***sythndata-main.js*** located in the directory **/var/www/html/webclient/plugins/edu/pitt/dbmi/synth-data/js** and change the value of ```i2b2.sythndata.rest.url``` to the actual URL.

For an example, assume that the REST API URL is ***http://localhost*** listening on port ***3005***.

```
i2b2.sythndata.rest.url = 'http://localhost:3005';
```
