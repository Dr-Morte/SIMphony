for file in "$1"/*
do
  if [[ $file == *.wav ]]
  then
    echo "$file"
    oggenc -q -1 -o ${file::${#file}-4}.ogg $file
  fi
done
