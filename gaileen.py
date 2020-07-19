class gaileen:
    
    enc_plain = [">","<","^","v",">>","<<",".",".>","<.","^.",".v","..","O","Ø","X","/","\\","\\\\","//","/.","\\.","./",".\\",":","+","="]
    enc_html = [">","<","^","v",">>","<<",".",".>","<.","^[br].",".[br]v","..","O","Ø","X","/","\\","\\\\","//","/.","\\.","./",".\\",":","+","="]

    enc = enc_html

    alph = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

    def __init__(self, key):
        self.pattern = key

    def setKey(self, key):
        self.pattern = key

    def getKey(self):
        return self.pattern

    def setPlain(self):
        self.enc = self.enc_plain

    def setHtml(self):
        self.enc = self.enc_html

    def encode(self, phrase, space=False):

        coded = ""

        i = 0

        for c in phrase:
             
            pos = -1
            try:
                pos = self.alph.index(c)
            except ValueError:
                pos = -1
            #print(pos)
            if (pos > -1):
                #print("pattern index=" + str(i))
                newpos = pos + self.pattern[i] if (pos + self.pattern[i] < 26) else pos + self.pattern[i] - 26
                coded = coded + self.enc[newpos]
                if (space):
                    coded = coded + " "
                i += 1
                if (i == len(self.pattern)):
                    i = 0

        #print(coded)
        return coded

    def decode(self,phrase):

        decoded = ""

        i = 0

        for c in phrase:

            pos = -1
            try:
                pos = self.enc.index(c)
            except ValueError:
                pos = -1
            # print(pos)
            if (pos > -1):
                newpos = pos - self.pattern[i] if (pos - self.pattern[i] >= 0) else pos - self.pattern[i] + 26
                decoded = decoded + self.alph[newpos]
                
                #print(c + "=" + self.alph[newpos] + " pos = " + str(pos) + " i = " + str(i)) 
                i += 1
                if (i == len(self.pattern)):
                    i = 0

        #print(decoded)
        return decoded



