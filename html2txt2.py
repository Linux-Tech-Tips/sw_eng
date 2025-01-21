#check for correct number of arguments
#create text file with correct title
#open html file
#read it in line by line
#use regex to find <script --> delete each character until we hit </script>
#use regex to find <
#delete each next character until we hit >
#if we don't hit a >, delete each character in the next line until we hit >
#convert all html entities to the proper characters

import sys
import re
import html

print(re.search("c", "abcdef"))
print(re.search("food", "I like foods"))

"""
if(len(sys.argv)!=2):
  print("incorrect number of arguments")
  quit()

inFile = sys.argv[1] #takes the name of the html file as a command line argument
title = inFile #copy the name of the file and edit it to be .txt instead of .html
title = title.split(".")
title[-1]="txt"
outFile=".".join(title)
outFile = "./"+outFile

with open(inFile, 'r') as f: #opens the original file for reading
  for line in f:
    line = f.readline()#read in each line
   """ 
