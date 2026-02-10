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