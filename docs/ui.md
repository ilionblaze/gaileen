# Gaileen Cipher Wheel UI

## GOAL

Design a web based UI to provide an interface for encoding and decoding messages based on the Gaileen Cipher described in this repository.

## Technology

The UI front-end will be a react based web service. We need to create docker container to run the web service and th python backend. 

## Reference

Read cipher.py, gaileen.py, and README.md to understand how the python scripts work. 

Read C:\Users\ilion\Documents\Projects\agent-skills\skills\react-best-practices\AGENTS.md to understand react best practices. WE MUST OBEY REACT BEST PRACTICES.

## Design

**IMPORTANT** Maintain SOLID principles.

## Interface

### Phase 1

Show two input boxes. 1 is labled encode and one is labeled decode. A third box is labeled Key. 

We need two buttons, encode and decode. 

When the encode button is clicked we need to send the text in the encode input box and the key to gaileen.py. Use the -p flag during encoding. Clear any current text for the decode input box and fill it with the output from the script. 

When the decode button is clicked we need to send the text in the decode input box and the key to gaileen.py. Use the -p flag during encoding. Clear any current text for the encode input box and fill it with the output from the script. 

Create tests for all generated functions.

### Phase 2

We want to improve the GUI experience.

We want to display an animated cypher wheel. An example of a cypher wheel can be found here: "C:\Users\ilion\Downloads\cipherwheel.jpg" . Note there are two layers. A larger layer that stays stationary and displays the outer ring of alphabetical characters. The inner ring rotates. The one in the image displays a "Shift" number as it rotates around by having a whole in the second layer to display numbers from 0 - 25 printed on the lower layer corresponding with the placements of A - Z on the wheel. 

Our version of the wheel needs to have the characters of the Gaileen cipher. On page the wheel should begin to slowly rotate.

When the Encode or Decode button is pressed we should see the wheel spin to properly do the encoding or decoding. This means the "Shift" position needs to be lined up correctly for each character. The speed at which this is done should be easily configurable.

Add Copy To Clipboard functionality for both the Encoded and Decoded text boxes.

Create a Dark Mode option. 