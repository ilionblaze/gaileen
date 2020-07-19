#! /usr/bin/env python

import argparse
from gaileen import gaileen

parser = argparse.ArgumentParser(description='Encode or decode a message.')
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('-e','--encode', action='store_true', help="Set to encode mode.")
group.add_argument('-d','--decode', action='store_true', help="Set to decode mode.")
parser.add_argument('-k','--key', default="7,9,8,0,5,0,7", help="A comma separated positional key")
parser.add_argument('-s','--spaces', action='store_true', help="Add spaces to output. Only used for encoding.")
parser.add_argument('phrase', nargs='+', help='Phrase to be encoded or decoded. (Encoding is the default)')
args = parser.parse_args()

if (args.encode):
    sep = ""
    joined = sep.join(args.phrase)
    key = [int(i) for i in args.key.split(",")]
    g = gaileen(key)
    result = g.encode(joined, args.spaces)
    print(result)
elif (args.decode):
    phrase = args.phrase[0].split()
    key = [int(i) for i in args.key.split(",")]
    g = gaileen(key)
    result = g.decode(phrase)
    print(result)


"""
result = decode(["<.",">","O","<","X","<"],[0])
if (result == "iambob"):
    print("Passed Test 3!")
else:
    print("Failed Test 3!")
"""
