# VPS Settings

This is the configuration of VPS for We-Chess App

## Remember these points

1. Remember to use SSL and a secure and properly nginx configuration for production.
2. Disabled port Redis container module to internet and only use internally, configure ufw firewall to block redis port.
3. Proxy payment endpoint for stripe webhook events like this example:
   `location /payment/...route {
    proxy_pass http://<name-container-docker-service>:<port>/;
    ...
}`
   That way NGINX can reach the payment container through the internal Docker network.

## Initial configuration (APPLIED AT March 24)

`root@srv768144:~# systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
Active: active (running) since Mon 2025-03-24 16:40:35 UTC; 56s ago
Docs: man:nginx(8)
Process: 3073 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
Process: 3075 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
Main PID: 3076 (nginx)
Tasks: 2 (limit: 4654)
Memory: 1.7M (peak: 2.0M)
CPU: 11ms
CGroup: /system.slice/nginx.service
├─3076 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
└─3077 "nginx: worker process"

Mar 24 16:40:35 srv768144 systemd[1]: Starting nginx.service - A high performance web server and a reverse proxy server...
Mar 24 16:40:35 srv768144 systemd[1]: Started nginx.service - A high performance web server and a reverse proxy server.
root@srv768144:~#
root@srv768144:~# cd /var/
root@srv768144:/var# ls
backups cache crash lib local lock log mail opt run snap spool tmp www
root@srv768144:/var# cd ..
root@srv768144:/# cd /etc/nginx/
root@srv768144:/etc/nginx# ls
conf.d fastcgi_params koi-win modules-available nginx.conf scgi_params sites-enabled uwsgi_params
fastcgi.conf koi-utf mime.types modules-enabled proxy_params sites-available snippets win-utf
root@srv768144:/etc/nginx#
root@srv768144:/etc/nginx# cd
root@srv768144:~#
root@srv768144:~#
root@srv768144:~#
root@srv768144:~#
root@srv768144:~# sudo apt install ufw
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
ufw is already the newest version (0.36.2-6).
ufw set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 24 not upgraded.
root@srv768144:~# ufw app list
Available applications:
Nginx Full
Nginx HTTP
Nginx HTTPS
OpenSSH
root@srv768144:~# sudo ufw allow ssh
Rules updated
Rules updated (v6)
root@srv768144:~# sudo ufw allow http
Rules updated
Rules updated (v6)
root@srv768144:~# sudo ufw allow ‘Nginx HTTP’
ERROR: Need 'to' or 'from' clause
root@srv768144:~# sudo ufw allow Nginx HTTP
ERROR: Need 'to' or 'from' clause
root@srv768144:~# sudo ufw allow 'from' ‘Nginx HTTP’
ERROR: Wrong number of arguments
root@srv768144:~# sudo ufw allow from ‘Nginx HTTP’
ERROR: Wrong number of arguments
root@srv768144:~# sudo ufw allow Nginx HTTP
ERROR: Need 'to' or 'from' clause
root@srv768144:~# - sudo systemctl enable ufw
-: command not found
root@srv768144:~# sudo systemctl enable ufw
Synchronizing state of ufw.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable ufw
root@srv768144:~# sudo systemctl status ufw
● ufw.service - Uncomplicated firewall
Loaded: loaded (/usr/lib/systemd/system/ufw.service; enabled; preset: enabled)
Active: active (exited) since Mon 2025-03-24 16:35:23 UTC; 10min ago
Docs: man:ufw(8)
Main PID: 477 (code=exited, status=0/SUCCESS)
CPU: 22ms

Mar 24 16:35:23 ubuntu-24 systemd[1]: Starting ufw.service - Uncomplicated firewall...
Mar 24 16:35:23 ubuntu-24 systemd[1]: Finished ufw.service - Uncomplicated firewall.
root@srv768144:~# sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
root@srv768144:~#
root@srv768144:~#
root@srv768144:~#
root@srv768144:~# sudo systemctl status ufw
● ufw.service - Uncomplicated firewall
Loaded: loaded (/usr/lib/systemd/system/ufw.service; enabled; preset: enabled)
Active: active (exited) since Mon 2025-03-24 16:35:23 UTC; 11min ago
Docs: man:ufw(8)
Main PID: 477 (code=exited, status=0/SUCCESS)
CPU: 22ms

Mar 24 16:35:23 ubuntu-24 systemd[1]: Starting ufw.service - Uncomplicated firewall...
Mar 24 16:35:23 ubuntu-24 systemd[1]: Finished ufw.service - Uncomplicated firewall.
root@srv768144:~#
root@srv768144:~#
root@srv768144:~#
root@srv768144:~# ufw status
Status: active

To Action From

---

22/tcp ALLOW Anywhere  
80/tcp ALLOW Anywhere  
22/tcp (v6) ALLOW Anywhere (v6)  
80/tcp (v6) ALLOW Anywhere (v6)

root@srv768144:~# cd /etc/init.d/
root@srv768144:/etc/init.d# ls
apparmor console-setup.sh cryptdisks dbus iscsid kmod open-iscsi plymouth procps rsync ssh ufw uuidd
apport cron cryptdisks-early grub-common keyboard-setup.sh nginx open-vm-tools plymouth-log qemu-guest-agent screen-cleanup sysstat unattended-upgrades
root@srv768144:/etc/init.d# cd
root@srv768144:~#
root@srv768144:~# sudo /etc/init.d/apache2 stop
sudo: /etc/init.d/apache2: command not found
root@srv768144:~#
root@srv768144:~#
root@srv768144:~# systemctl start nginx
root@srv768144:~# systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
Active: active (running) since Mon 2025-03-24 16:40:35 UTC; 8min ago
Docs: man:nginx(8)
Main PID: 3076 (nginx)
Tasks: 2 (limit: 4654)
Memory: 1.7M (peak: 2.0M)
CPU: 11ms
CGroup: /system.slice/nginx.service
├─3076 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
└─3077 "nginx: worker process"

Mar 24 16:40:35 srv768144 systemd[1]: Starting nginx.service - A high performance web server and a reverse proxy server...
Mar 24 16:40:35 srv768144 systemd[1]: Started nginx.service - A high performance web server and a reverse proxy server.
root@srv768144:~#
root@srv768144:~# mkdir repos`
