import xml.etree.ElementTree as ET
import glob

path = "C:\\Users\\quinn\\Desktop\\dev\\among-us-detector\\backend\model\\images\\data"


files = glob.glob(path + "\\" + "*.xml")


for file in files:
    et = ET.parse(file)

    root = et.getroot()

    for type_tag in root.findall('filename'):
        name, fileType = type_tag.text.split('.')
        
        if fileType == 'png':
            type_tag.text = name + ".jpg"


    for type_tag in root.findall('path'):
        name, fileType = type_tag.text.split('images\\')[1].split('.')


        if fileType == 'png':
            type_tag.text =  "C:\\Users\\quinn\\Desktop\\dev\\among-us-detector\\backend\model\\images\\" + name + ".jpg"


    et.write(file)



