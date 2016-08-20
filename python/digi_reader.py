#!/usr/bin/env python
# -*- coding: utf-8 -*-

#To Run:
# type input_file.txt | python digi_reader.py >> output.csv

import sys

from digikey import *

#Takes in String of Barcode and returns Data
def barcodeScan(line):

	sys.stderr.write('\n\n-------------------------------------\n')

	data = None

	sys.stderr.write('info: code read: {}\n'.format(line))

	if len(line) >= 22: # digikey bag code
		prod_id = line[0:7]
		qnt = line[8:16]

		#If the code ends in a zero (Remove it due to search engine problems)
		if line[6] == "0":
			newList = list(prod_id)
			del(newList[6])
			prod_id = "".join(newList)
			sys.stderr.write('info: String end popped: {}\n'.format(prod_id))

		#If the code starts with a zero (Remove it due to search engine problems)
		if line[0] == "0":
			newList = list(prod_id)
			del(newList[0])
			prod_id = "".join(newList)
			#sys.stderr.write('info: String front popped: {}\n'.format(prod_id))

		data = barcode2data(prod_id)
	elif '-ND' in line: # digikey part/number
			data = partNumber2Data(line.strip())
	elif '-' in line:	# mouser code
			data = mouser2data(line.strip())
	else:
		sys.stderr.write('info: cannot parse code, no valid format : {}\n'.format(line))

	if data is not None:
		#print "%s, %s, %s, %s" % (data['provider'], data['provider_pn'], data['manufacturer_pn'], data['description'])
		return data


code = sys.argv[1].strip()
data = barcodeScan(code)
#arrayOut = [data['provider'], data['provider_pn'], data['manufacturer_pn'], data['description']]
print(data['provider'] + "||" + data['provider_pn'] + "||" + data['manufacturer_pn'] + "||" + data['description'])
sys.stdout.flush()
