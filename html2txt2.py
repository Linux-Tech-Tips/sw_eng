import sys
import re
import html


if(len(sys.argv)!=2):
  print("incorrect number of arguments")
  quit()

inFile = sys.argv[1] #takes the name of the html file as a command line argument
title = inFile #copy the name of the file and edit it to be .txt instead of .html
title = title.split(".")
title[-1]="txt"
outFile=".".join(title)


with open(inFile, 'r') as f: #opens the original file for reading
  with open(outFile, 'w') as w: #opens the new file for writing  
    while True:
      line = f.readline()#read in each line
      if not line:
        break
      if(re.search("<script", line)!=None): #if there's script tag --> skip to next line until </script> is found
        while(re.search("</script>", line)==None):
          line = f.readline() 
        line = f.readline() #remove the line with the </script>
      line = re.sub("<.*?>","", line) #removes all text inside <>
      if(re.search("<", line)!=None): #if there's an open tag --> delete every line until it ends
        while(re.search(">", line)==None):
          line = f.readline()
        line = f.readline() #remove the last line of the tag
      line = html.unescape(line) #process all html entities
      w.write(line)
    w.close()
  f.close()

