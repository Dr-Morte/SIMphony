spawn_curl()
{
    curl -w "@stressTestFormat.txt" -o NUL -s http://thesimphony.com/generate/demo%Hierdec_16bar:80
}

for i in `seq 1 100`;
do
    spawn_curl &
    pids[${i}]=$!
done

for pid in ${pids[*]};
do
    wait $pid
done
echo "Completed 100 requests to server"
read -n1 -r -p "Press space to continue..." key