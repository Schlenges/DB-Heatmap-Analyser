# Project Heatmap
A project developed for Deutsche Bahn, a German railway company, to download, compare, and show the differences between heatmap files.
  
## Installation Prerequisits:
* Docker
* For building purposes:
  * node_js (11)
  * asciidoctor

## Starting Local Minio Server:
* Create shared folders for the Minio server:
  ```bash
  mkdir -p ~/docker/mnt/{data,config}
  ```
* First time launch and gathering secrets (will only be printed if docker is started with **-it** or restarted with **-a**
  ```bash
  docker run -p 9000:9000 -it --name minio1 -v ~/docker/mnt/data:/data -v ~/docker/mnt/config:/root/.minio minio/minio server /data
  ```
* Second or later start (if you need the secrets again, append option **-a**):
  ```bash
  docker start minio1
  ```

 ## V1. Starting Heatmap Analysis Docker Container
 Create folders data and config for the application
 ```bash
 mkdir -p ~/docker/heatmap/{data,config}
 ```
 In ```~/docker/heatmap/config```, create a file with the name **client.json**. Configure your client using the following scheme:
  ```json
  {
    "MINIO_ENDPOINT": "url_of_minio_server",
    "MINIO_PORT": 9000, 
    "MINIO_USE_SSL": false, 
    "MINIO_ACCESSKEY": "The_Access_key_described_above_from_minio",
    "MINIO_SECRETKEY": "The_secret_described_above_from_minio"
   } 
   ```
* Set the access- and secret key in the file to the ones you have been provided with when launching your local Minio server
* The endpoint should be your most public IP address  
    (On Linux and OS X you can use the command ```ip route get 1 | awk '{print $NF;exit}'```to get the one of your localhost)
    
Run the application with:  

**docker run -v ~/docker/heatmap/config:/config -v ~/docker/heatmap/data:/data schlenges/heatmap $OLD_ARCHIVE $NEW_ARCHIVE $FILENAME $BUCKET**

* **$OLD_ARCHIVE** and **$NEW_ARCHIVE** are the names of the zip archives you want to download (e.g. file.zip)
* **$NEW_ARCHIVE** should be the archive that contains more recent data, **$OLD_ARCHIVE** the one you want to compare it to
* **$FILENAME** is the name of the relevant json file within the archives that you want to compare to each other (e.g. result.json)
* **$BUCKET** is the name of the bucket you want to download from
