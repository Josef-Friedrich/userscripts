#! /bin/sh

if ! command -v http-server ; then
	npm install -g http-server
fi

http-server
