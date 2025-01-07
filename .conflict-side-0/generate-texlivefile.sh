#!/bin/bash
grep "{package}" *.dep | sed s/"  \*{package}{\([^}]*\).*/\1/" | sort | uniq > Texlivefile
