#!/usr/bin/python
# coding: utf-8

from __future__ import print_function

import re
import c3d
import sys
import csv
import os

basepath = os.path.normpath("data")

def writeCSVLine(handle, writer, string):
  target = os.path.basename(handle)
  ID = target.split("_")[ 0 ]
  components = string.split("SUBJECT.VALUES")
  del components[ 0 ]
  del components[ 0 ]
  data = []
  for component in components:
    m = re.search(r".*= (.*)", component)
    field = m.group(1)
    data.append(field)
  age = data[ 0 ]
  gender = data[ 1 ]
  weight = data[ 2 ]
  height = data[ 3 ]
  rightleg = data[ 4 ]
  leftleg = data[ 5]
  writer.writerow([ID, age, gender, weight, height, rightleg, leftleg])


  #print(components)
  #participant = ID

  #for index, line in enumerate(string):
  #  if "SUBJECT.VALUES[" in line:
  #    participant += ", " + line.split()[-1]
  #writer.writerow(participant.split(', '))


def main():
  with open('participants.csv', mode='w') as participants:
    writer = csv.writer(participants, delimiter=',')
    writer.writerow(['ID', 'Age', 'Gender(0-woman 1-man)', 'Weight', 'Height', 
                     'Right leg length', 'Left leg length'])

    file_pattern = re.compile(r".*_C1_01.c3d")
    basepath_directory_contents = os.listdir(basepath)
    for target_directory in basepath_directory_contents:
      target_path = os.path.join(basepath, target_directory)
      if (os.path.isdir(target_path)):
        data_files = filter(file_pattern.match, os.listdir(target_path))
        for data_file in data_files:
          data_file_path = os.path.join(basepath, target_directory, data_file)
          handle = data_file
          try:
            string = ''
            string = string + '*** {} ***'.format(data_file)
            with open(data_file_path, 'rb') as handle:
             string = get_metadata(c3d.Reader(handle))
             #print(string)
             writeCSVLine(data_file_path, writer, string)
          except Exception as err:
            print(err)

def get_metadata(reader):
    string = ''
    #string = string + 'Header information:\n{}'.format(reader.header)
    #groups = ((k, v) for k, v in reader.groups.items() if isinstance(k, str))
    groups = reader.groups.items()

    for key, g in sorted(groups):
        #if not isinstance(key, int):
        if key == 'SUBJECT':
            for x, p in sorted(g.params.items()):
                if x == 'VALUES':
                  #print(x, p)
                  #print("Got here")
                  #temp = get_param(g, p)
                  #print(temp)
                  #print(get_param(g, p))
                  string = string + get_param(g, p)
                  #string = string + '\n'
    #print(string)
    return string

def get_param(g, p):
    string = ''
    string = string + '{0.name}.{1.name}: {1.total_bytes}B {1.dimensions}'.format(g, p)

    if len(p.dimensions) == 0:
        val = None
        width = len(p.bytes)
        if width == 2:
            val = p.int16_value
        elif width == 4:
            val = p.float_value
        else:
            val = p.int8_value
        string = string + '{0.name}.{1.name} = {2}'.format(g, p, val)

    if len(p.dimensions) == 1 and p.dimensions[0] > 0:
        arr = []
        width = p.total_bytes // p.dimensions[0]
        if width == 2:
            arr = p.int16_array
        elif width == 4:
            arr = p.float_array
        else:
            arr = p.int8_array
        for r, v in enumerate(arr):
            string = string + '{0.name}.{1.name}[{2}] = {3}'.format(g, p, r, v)

    if len(p.dimensions) == 2:
        C, R = p.dimensions
        for r in range(R):
            string = string + '{0.name}.{1.name}[{2}] = {3}'.format(
                g, p, r, repr(p.bytes[r * C:(r+1) * C]))

    return string

## main entry point

if __name__ == '__main__':
  main()
