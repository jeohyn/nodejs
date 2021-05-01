print image's internal file system structure   
=============
 `docker run imageName ls`   
-------------
#### →docker : make sure it's docker client's   
#### →run : create or execute container   
#### →imageName : image for this container   
#### →ls : print currnet directory's file list   
#### +)the location of "ls" : ignore the image's start command and execute the command in this location   
#### ▷only can use "ls" if there's any file to execute "ls"   

print container list   
=============
`docker ps`   
-------------
#### →docker : make sure it's docker client's   
#### →ps : process status   
#### CONTAINER ID : container's unique id hash value   
#### IMAGE : image that used to create container   
#### COMMAND : command that execute when the container starts   
#### CREATED : the time container created   
#### STATUS : container's status. Up:executing, Exited:finished, Pause:pause   
#### PORTS : ports that the container open and connected to host. if there's any command about this, no print.   
#### NAMES : container's unique name. if you don't set name by --name option when create a container, docker engine creates it with adjective and noun. can rename by `docker rename original-name changed-name` command.   

#### +) if you want to see specific columns   
#### >>`docker ps --format colName \t colName`   
###### ex) if you want to see NAME and IMAGE   
###### >>`docker ps --format table{{.Names}} \t table{{.IMAGE}}`   

#### print all container   
#### >>`docker ps -a`   

commands about container's life cycle   
=============
▷create   
-------------
>>`docker create imageName`   
>>→returns container's Id   

▷start and running   
-------------
>>`docker start -a containerName(or Id)`   
>>→-a : attach. if you want to type a part of container id, you need to add -a option. print the output of excution of docker container   

▷create, start, and running   
-------------
`docker run imageName`   
-------------
#### =`docker create imageName AND docker start containerName(or Id)`   

##### +)`docker run -p 5000(=localhost portNumber that I set) :containerPortNumber(server.js(nodejs) port num) imageName`   
>→connect local network to container's network   
>→-p : port   
>→there's no space between : and containerPortNumber   

#### `docker run -d -p 5000(=localhost portNumber that I set):containerPortNumber(server.js(nodejs) port num) imageName`   
>→-d: detach. get out to terminal directly after running a container   

>> +)run application using Volume-no need to build again after change app code   
>> `docker run -p 5000(=localhost portNumber that I set) :containerPortNumber(server.js(nodejs) port num) -v /usr/src/app/node_modules -v %cd%:/usr/src/app imageId`   
>> →-v /usr/src/app/node_modules : there's no node_modules folder in local so no mapping      
>> →-v %cd%:/usr/src/app : where container(/usr/src/app. working directory) reference in local(%cd%)(mapping). this is for window cmd.      
>> for MAC, -v $(pwd):/usr/src/app, for window powershell, -v ${pwd}:/usr/src/app   

▷stopped(make running container stop)   
-------------
`docker stop containerName(or Id)`   
`docker kill containerName(or Id)`   
-------------

>＃docker stop vs docker kill
>>stop : stop after few sec(stop gracefully. finish the ongoing task and then stop)   
>>→grace period : time it takes to finish the ongoing task   
>>docker stop->SIGTERM(grace period)->SIGKILL->stop main process   

>>kill : stop directly   
>>docker stop->SIGKILL->stop main process   

▷deleted(delete stopped container)   
-------------
`docker rm containerName(or Id)`   
-------------
→only can delete stopped container   

#### delete all stopped container   
#### >>`docker rm `docker ps -a -q` `  

#### delete images   
#### >>`docker rmi imageId`   

#### delete container, image, network   
#### >>`docker system prune`   

send command to running container   
=============
`docker exec containerId command`   
-------------
#### same result : >>docker run imageName command   

#### +) -it option : i→interactive, t→terminal. you can send command constantly if you add -it option between exec and containerId   

##### ex) `docker exec (redis server id) redis-cli` : start redis client and go out that container(I'm not in the redis server&client container)   

##### `docker exec -it (redis server id) redis-cli` : start redis client and I can type command to redis client.(constantly I'm in the redis server & client container)   

###### +)if you need to send commands, you can use "sh"||"bash"||"zsh"|| "powershell" (depend on your environment) in command.    
###### +)if you use "sh"||"bash"||"zsh"|| "powershell", you can connect to that container's shell/terminal(sh is the most common)   
###### →`docker run vs docker exec`   
###### run : create new container   
###### exec : send command to running container   

create image   
=============
`docker build ./`   
-------------
#### +) `docker build -t [myDockerId]/[repo or proj name]:[version] ./`   
#### →give a name to docker image=>I can use repo or proj name instead of imageId   

start and stop container by docker compose
=============
▷start
-------------
`docker-compose build`
-------------
#### build image, not start container
-------------
`docker-compose up`
-------------
#### build only if there's no image, and start container
-------------
`docker-compose up --build`
-------------
#### build forcely whenever it doesn't need to, and start container
-------------
`docker-compose up --no-build`
-------------
#### without build, start container(if there's no image, it fails)
-------------
`docker compose -d up`
-------------
#### detached mode. execute app in the background, so we can't see the output from the app


▷stop
-------------
`docker-compose down`
-------------
#### stop all containers started by docker compose at once

