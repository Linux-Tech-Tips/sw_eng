#!/bin/bash

# Requires a LaTeX installation and pdflatex to function properly
# Called twice to ensure table of contents is generated correctly
mkdir -p tex_out
pdflatex -output-directory=tex_out index.tex
pdflatex -output-directory=tex_out index.tex
