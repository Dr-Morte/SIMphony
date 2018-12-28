import argparse
import os
import re
def argument_parse():

    parser = argparse.ArgumentParser(description='MusicVAE')

    parser.add_argument("--config_file" , dest="config_file" , type=str)
    subparsers = parser.add_subparsers(dest="execution" , help='Type of execution')

    sub_parser_1 = subparsers.add_parser("Training")
    sub_parser_2 = subparsers.add_parser("Generation")
    sub_parser_3 = subparsers.add_parser("NoteSequence")

    #Training Subparsing

    sub_parser_1.add_argument('--config', dest='config' , type=str,
                    help='Config')
    sub_parser_1.add_argument("--run_dir" , dest='run_dir' , type=str)
    sub_parser_1.add_argument("--note_sequence" , dest="note_sequence" , type=str)
    sub_parser_1.add_argument("--batch_size" , dest="batch_size")
    sub_parser_1.add_argument("--learning_rate" , dest="learning_rate")

    #Generation Subparsing

    sub_parser_2.add_argument('--config', dest='config' , type=str,
                    help='Config')
    sub_parser_2.add_argument('--checkpoint_name', dest='checkpoint' , type=str,
                    help='Checkpoint name without the .ckpt')
    #Look into mode
    sub_parser_2.add_argument("--output_path" , dest="output_path" , type=str)
    sub_parser_2.add_argument("--num_outputs" , dest="num_outputs" , type=str)
    #NoteSequence Subparsing

    sub_parser_3.add_argument("--input_dir" , dest='input_dir' , type=str)
    sub_parser_3.add_argument("--ns_file" , dest='ns_file' , type=str)


    args = parser.parse_args()

    return args

def main():
    args = argument_parse()
    python_path = "python"
    train_path = ""
    generate_path = ""
    note_sequence_path = ""
    with open(args.config_file) as file:
        for lines in file:
            arguments = re.split("=" , lines)
            arguments[1] = re.sub("\n" , "", arguments[1])
            if("python_path" in arguments[0]):
                python_path = os.path.normpath(arguments[1])
            elif("train_path" in arguments[0]):
                train_path = arguments[1]
            elif("generate_path" in arguments[0]):
                generate_path = arguments[1]
            elif("note_sequence_path" in arguments[0]):
                note_sequence_path = arguments[1]

    if args.execution == "Training":
        execution_string = "music_vae_train --config={} --run_dir={} --hparams=batch_size={},learning_rate={}" \
                           " --mode=train --examples_path={}".format(args.config, args.run_dir,
                                                                    args.batch_size,
                                                                    args.learning_rate,
                                                                    args.note_sequence)
        os.system(execution_string)
    elif args.execution == "Generation":
        execution_string = "{} {} --config={} --checkpoint_file={}.ckpt " \
                           "--mode=sample --num_outputs={} " \
                           "--output_dir={}".format(python_path , generate_path , args.config , args.checkpoint , args.num_outputs , args.output_path)
        os.system(execution_string)
    elif args.execution == "NoteSequence":
        execution_string = "convert_dir_to_note_sequences --input_dir={} --output_file={}.tfrecord " \
                           "--recursive".format( args.input_dir , args.ns_file)
        os.system(execution_string)
if __name__ == '__main__':
    main()
