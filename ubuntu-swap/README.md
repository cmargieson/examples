---
title: "Increasing Swap File Size in Ubuntu"
published: true
---

Use grep to return the SwapTotal value in the meminfo file. 

This is the current size of the swap file.

```console
~# grep SwapTotal /proc/meminfo
```

Disable swapping using the swapoff command. 

Use -a flag to apply to all swap files.

```console
~# sudo swapoff -a
```

Create an eight gigbyte swap file named ‘swapfile’. 

Use dd to convert and copy file. 

Use ‘if’ for input file, ‘of’ for output file, ‘bs’ for number of bytes to write at a time and ‘count’ for ‘bs’ sized blocks to write.

```console
~# sudo dd if=/dev/zero of=/swapfile bs=1G count=8
```

```console
~# sudo mkswap /swapfile
```

Swapfile should be owned by root. 

Read and write for owner, which is now root.

```console
~# sudo chown root:root /swapfile 
~# sudo chmod 0600 /swapfile
```

And turn it on again!

```console
~# sudo swapon /swapfile
```

Use grep to check that the SwapTotal value now reflects the size of the new swap file.

```console
~# grep SwapTotal /proc/meminfo
```

Add the the following line to /etc/fstab to make the swap file permanent.

```console
~# echo "/swapfile none swap sw 0 0" >> ~/etc/fstab
```

