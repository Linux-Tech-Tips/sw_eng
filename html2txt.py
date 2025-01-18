import sys
import re
import html

inFile = sys.argv[1] #takes the name of the html file as a command line argument
title = inFile #copy the name of the file and edit it to be .txt instead of .html
title = title.split(".")
title[-1]="txt"
outFile=".".join(title)
outFile = "./"+outFile

f = open(inFile, 'r') #opens the original file for reading
lines = f.readlines() #reads in all lines as a list
lines = '\t'.join([line.strip() for line in lines]) #merge the list into one big string, removing newlines and trailing whitespace
lines = re.sub("(\s)*<script[\s\S]*?\/script>(\s)*", "", lines) #remove everything inside of script tags
lines=re.sub("<.*?>","", lines) #removes all text inside <>
lines=html.unescape(lines) #process all html entities
f.close()

with open(outFile, "w") as f: #open file for txt version
  f.write(lines) #write processed lines
  f.close()

