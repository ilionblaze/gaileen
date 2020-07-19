import unittest
from gaileen import gaileen

class test_gaileen(unittest.TestCase):

    def setUp(self):
        self.g = gaileen([0])

#    def tearDown(self):
#       self.g.dispose()

    def test_simple_encode(self):
        self.assertEqual(self.g.encode("i am bob"), "<.>O<X<", "Incorrect encoding in 0th position.")

    def test_simple_shift_encode(self):
        self.g.setKey([7])
        self.assertEqual(self.g.encode("safe house"), "=.>O..X./<=..", "Incorrect encoding in 7th position.")

    def test_simple_key(self):
        self.g.setKey([0,1])
        self.assertEqual(self.g.encode("sheep dog"), "//<.>><</>>X.>", "Incorrect encoding for simple key.")
