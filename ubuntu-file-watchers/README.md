---
title: "Increasing File Watchers Number in Ubuntu"
published: true
---

Get current watch limit:

```console
~# cat /proc/sys/fs/inotify/max_user_watches
```

Set new limit:

```console
~# sudo sh -c "echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf"
```

```console
~# sudo sysctl -p
```