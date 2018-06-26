from library.siamese import SiameseFaceNet
import os
import sys
import json

def main():
    label = sys.argv[1]
    syspath = sys.argv[2]

    fnet = SiameseFaceNet()
    model_dir_path = syspath + 'backend/pyScripts/models'
    fnet.load_model(model_dir_path)

    database = dict()
    database[label] = []

    image_dir_path = syspath + 'backend/pyScripts/data/' + label + '/left'
    imgs = os.listdir(image_dir_path)
    for img in imgs:
        if (not img.endswith('sq.jpg')):
            continue
        database[label].append(fnet.img_to_encoding(image_dir_path+'/'+img))

    image_dir_path = syspath + 'backend/pyScripts/data/' + label + '/right'
    imgs = os.listdir(image_dir_path)
    for img in imgs:
        if(not img.endswith('.jpg')):
            continue
        database[label].append(fnet.img_to_encoding(image_dir_path + '/' + img))

    dist, isvalid = fnet.verify(syspath + 'backend/pyScripts/data/TEMP/temp/00001sq.jpg', label, database, 0.4)

    if(isvalid==True):
        return 0

    else:
        return -1


if __name__ == '__main__':
    if(main()==0):
        jsonob = {'result': 0}
        strjson = json.dumps(jsonob, sort_keys=True)
        print(strjson)
    else:
        jsonob = {'result': 1}
        strjson = json.dumps(jsonob, sort_keys=True)
        print(strjson)
