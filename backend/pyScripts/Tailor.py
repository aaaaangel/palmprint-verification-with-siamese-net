import cv2
import math
import numpy as np
import os
import sys
import json


def tailor(label,direction, index, syspath):
    image_dir_path = syspath +'backend/pyScripts/data/'+label+'/'+direction
    img_path = image_dir_path+'/'+str(index).zfill(5)+'.jpg'
    txt_path = image_dir_path+'/'+str(index).zfill(5)+'.txt'
    out_name = image_dir_path+'/'+str(index).zfill(5)+'sq'+'.jpg'
    len_thresh = 10000
    img = cv2.imread(img_path)

    small = []
    big = []
    with open(txt_path) as f:
        cnt = 0
        for line in f:
            cnt += 1
            if cnt <= 5:
                continue

            str0 = line.split("(")[0].split(":")[0]
            if str0 == 'gap0':
                temp = line.split("(")
                if len(temp) == 2:
                    small.append(temp[1].split(")")[0].split())
                else:
                    small.append(big[len(big) - 1])
            elif str0 == 'gap1':
                temp = line.split("(")
                if len(temp) == 2:
                    big.append(temp[1].split(")")[0].split())
                else:
                    big.append(small[len(small)-1])
            else:
                break

    if len(small) != 3:
        return False

    realMinLen = 0
    for item in big:
        int_big = []
        for data in item:
            if data.isdigit():
                int_big.append(int(data))

        big_x = int_big[0] + int_big[2] / 2
        big_y = int_big[1] + int_big[3] / 2

        left = []
        right = []
        minLen = 999999999
        maxX = 0
        minX = 10000
        for gap in small:
            temp = []
            for item in gap:
                if item.isdigit():
                    temp.append(int(item))
            x = temp[0] + temp[2] / 2
            y = temp[1] + temp[3] / 2
            temp_len = math.pow(x - big_x, 2) + math.pow(y - big_y, 2)
            if temp_len < minLen:
                minLen = temp_len
            if x < minX:
                left = [x, y]
                minX = x
            elif x > maxX:
                right = [x, y]
                maxX = x
        if minLen > realMinLen:
            realMinLen = minLen
            unitLen = math.sqrt(minLen)

    print(realMinLen)
    if realMinLen < len_thresh:
        return False

    height = img.shape[0]  # 原始图像高度
    width = img.shape[1]  # 原始图像宽度
    angle = math.atan((right[1] - left[1]) / (right[0] - left[0])) * (180 / math.pi)
    # 按angle角度旋转图像
    rotateMat = cv2.getRotationMatrix2D((width / 2, height / 2), angle, 1)
    imgRotation = cv2.warpAffine(img, rotateMat, (width, height))
    [[left[0]], [left[1]]] = np.dot(rotateMat, np.array([[left[0]], [left[1]], [1]]))
    [[right[0]], [right[1]]] = np.dot(rotateMat, np.array([[right[0]], [right[1]], [1]]))
    mid = [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2]
    pt1 = [mid[0] - 0.6 * unitLen, mid[1] + unitLen * 0.2]
    pt2 = [pt1[0] + 1.2 * unitLen, pt1[1] + 1.2 * unitLen]
    imgOut = imgRotation[int(pt1[1]):int(pt2[1]), int(pt1[0]):int(pt2[0])]
    imgOut = cv2.resize(imgOut, (256, 256))
    cv2.imwrite(out_name, imgOut)
    return True


def main():
    label = sys.argv[1]
    direction = sys.argv[2]
    index = sys.argv[3]
    syspath = sys.argv[4]
    if(tailor(label, direction, index, syspath)):
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