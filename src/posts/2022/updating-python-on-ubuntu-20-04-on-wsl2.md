---
title: Updating Python on Ubuntu 20.04 on WSL2
description: Want to update Python to a newer version on WSL2? Here's one way.
date: 2022-05-14 19:00:00
tags: 
    - development
    - python
    - tutorial
    - ubuntu
image: https://images.unsplash.com/photo-1608501821300-4f99e58bba77
imageAlt: Dark swirls
---

Ubuntu on WSL2 currently comes loaded with Python v3.8, which is the default in Ubuntu 20.04. I wanted to update to Python v3.10, as I try to use more recent software releases when starting new projects. Updating Python took more work than I thought it would (I'm more familiar with Node and utilizing [node version manager](https://github.com/nvm-sh/nvm) to manage Node versions). Eventually I did get it all worked out, and in an effort to remember what I did, I'm writing this post to jot down the steps.^[Also, I had to use my bash history to find all the commands I ran...] 

Please be aware that I'm not fully up-to-date on current Python practices. Chances are these steps may not be best methods, but it worked for me.

## Steps

All instructions assume you're running them in a WSL2 terminal, not a Windows host terminal.

Quick overview:
1. Check current Python version
2. Add deadsnakes PPA and install Python 3.10
3. Update Python alias with update-alternatives
4. Install pip and other utilities

### 1. Check current Python version

It's always good to know what you already have so we can check by running a couple commands

```bash
python3 --version
```
Version 3.8.10 is the current Python version when running  vanilla, up-to-date Ubuntu 20.04 in WSL2. If this returns a version greater than 3.8.10, congrats, you're done!

You can see where it's loading python3 from by 

```bash
which python3
```
You must use `python3` as the Python command, as `python` is not installed in Ubuntu by default.^[Yes this confusing. There is a package called `python-is-python3` that you can install from apt should you desire, but step 3 in this guide shows how to specify alternates.]

### 2. Add deadsnakes PPA and install Python 3.10

The official method to install different version of Python is by downloading the source code and compiling it yourself. Rather than go through that, [deadsnakes has created a PPA](https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa) that contains recent versions of Python compiled for Ubuntu. 

To add this PPA to your system run

```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
```
Once added, you can now install Python 3.10 by running

```bash
sudo apt install python3.10
python3.10 --version #Python 3.10.4
which python3.10 #/usr/bin/python3.10
```

### 3. Update Python alias with update-alternatives

Since you can have multiple versions of Python installed side-by-side, it's important to preface all Python commands by specifying the specific version. By default, calling `python3` will use still use Python 3.8.10. If you want to use 3.10, you'll always have to call `python3.10`.

Notice also that calling `python` will still give a `command not found` message.

Ubuntu has a package called `update-alternatives` that can manage calling different versions of packages and have them share a common command. In this case, we want to be able to just use `python` to reference 3.10.4. You can do so by running

```bash
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.8 1
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.10 2
```
Now when you run `python --version` you should get `Python 3.10.4`.^[I'm not 100% sure that setting alternatives won't break something elsewhere in your system. If you'd rather not deal with it, just skip this step and be sure to always use the `python3.10` command.]

### 4. Install pip and other dependencies

To finish up, there's a few other Python tools necessary for development. You'll need `pip` for package management, `venv` for virtual environments, and a couple other tools:

```bash
sudo apt install python3-pip python3.10-pip python3.10-venv python3.10-distutils
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10
source ~/.bashrc
pip --version
```

#### 4.1 Virtual Environments

I always use a virtual environment when I do any Python project. You never know if you'll need to use a package not included in the standard library. Since we just installed a compatible version of `venv`, we can create a virtual environment in our project's root directory and activate it by

```bash
python -m venv venv
source venv/bin/activate
```
I usually also make sure the latest version of pip is installed in the virtual environment and can do so by

```bash
pip install -U pip
```

## Alternatives
There is [pyenv](https://github.com/pyenv/pyenv) that can perform similarly to node version manager. I did try to install this at one point a while ago, but I messed something up. I do think it'd be worthwhile to check out and try again in the future. 

## Final Thoughts
By no means am I a Python expert, but I wanted to jot down how I managed to update to a newer version of Python in WSL2. Hopefully these steps will at least point you in the right direction. Just to reiterate, there is most definitely a better method of doing this, but I got my system working well enough for me. If you know of a better way, [drop me a line](/about).
