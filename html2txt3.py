import sys
from html.parser import HTMLParser


class MyHTMLParser(HTMLParser):
    print = True

    def handle_starttag(self, tag, attrs):
        if(tag == "script"):
            self.print = False

    def handle_endtag(self, tag):
        if(tag == "script" and not self.print):
            self.print = True

    def handle_data(self, data):
        if(self.print):
            return data

inFile = sys.argv[1] #takes the name of the html file as a command line argument
title = inFile #copy the name of the file and edit it to be .txt instead of .html
title = title.split(".")
title[-1]="txt"
outFile=".".join(title)

parser = MyHTMLParser()

with open(outFile, "w") as w:
  with open(inFile, "r") as f:
    for line in f:
      parser.feed(line)
      
