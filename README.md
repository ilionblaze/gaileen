# Gaileen Cipher

The Gaileen Cipher was created in response to a [World Anvil Summer Camp 2020](https://www.worldanvil.com/community/challenge/summercamp-2020/homepage) writing prompt. The article this program supports can be found here: [Gaileen Cipher](https://www.worldanvil.com/w/anvimar-ilionblaze/a/gaileen-cipher-article)

# Requirements

This was developed in Python 3.7. Nothing else should be required.

# Encoding and decoding

Encoding is very simple. The biggest decision is whether you want spaces in the output for clarity or not.

    ./cipher
      - e | --encode - set to encode mode
      - s | --spaces - include spaces in output
      - k | --key    - a comma seperated positional key. The default is "7,9,8,0,5,0,7".
	  <phrase>       - the phrase you wish to encode. Currently must be lowercase.

Decoding is a very similar process although spaces are not an option. It's not possible to tell where they belong between words, so the task is left to the reader.

	./cipher
      -d | --decode - set to decode mode
      -k | --key    - a comma seperated positional key. The default is "7,9,8,0,5,0,7".
	  <phrase>      - the phrase you wish to decode. Due to the way some characters interact with the command line this should be quotated and there should be whitespace between code characters.
						e.g. '.\ + <<'

