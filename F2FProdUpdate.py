import sqlite3
import time as t
import pyodbc

from numpy.lib.function_base import diff
from UtilisF2FI import *
import datetime
import numpy as np


if __name__ == '__main__':
    connF2F = pyodbc.connect()
    curF2F = connF2F.cursor()
    #connF2F, curF2F = connectDB()
    connMII = sqlite3.connect('MII.db')
    curMII = connMII.cursor()
    

    reworkInfoNew = curF2F.execute(
        f"SELECT IDP, Quantity FROM ProdRework WHERE Date = (SELECT max(Date) FROM ProdScrap)").fetchall()
    reworkInfoOld = reworkInfoNew

    scrapInfoNew = curF2F.execute(
        f"SELECT IDP, Quantity FROM ProdScrap WHERE Date = (SELECT max(Date) FROM ProdScrap)").fetchall()
    scrapInfoOld = scrapInfoNew

    currentTime = datetime.datetime.now().strftime("%H:%M:%S")
    currentTime = datetime.datetime.strptime(currentTime, "%H:%M:%S")
    oldTime = currentTime
    while True:
        #print('___________________________________')

        reworkInfoNew = curF2F.execute(
            f"SELECT IDP, Quantity FROM ProdRework WHERE Date = (SELECT max(Date) FROM ProdRework)").fetchall()

        scrapInfoNew = curF2F.execute(
            f"SELECT IDP, Quantity FROM ProdScrap WHERE Date = (SELECT max(Date) FROM ProdScrap)").fetchall()

        #print(reworkInfoNew)
        #print(scrapInfoNew)

        fillProdData(connF2F, curF2F, connMII, curMII, 'volume')
        t.sleep(1)

        fillProdData(connF2F, curF2F, connMII, curMII, 'rework')
        t.sleep(1)

        fillProdData(connF2F, curF2F, connMII, curMII, 'scrap')
        t.sleep(1)

        # fillRealtimeKPI
        currentTime = datetime.datetime.now().strftime("%H:%M:%S")
        currentTime = datetime.datetime.strptime(currentTime, "%H:%M:%S")
        triggerTime = datetime.datetime.strptime("09:01:00", "%H:%M:%S")
        midnight = datetime.datetime.strptime("00:00:00", "%H:%M:%S")
        #print(currentTime, type(currentTime))
        currentDay = datetime.datetime.now()
        currentDay = currentDay.strftime("%A")
        # fill FACE TO FACE | RealtimeIndicator
        if currentTime > triggerTime and oldTime < triggerTime:
            todayDate = datetime.datetime.now().strftime(f"%Y-%m-%d")
            todayDate = '2020-11-19'
            IDKPI = curF2F.execute(
                "SELECT IDKPI FROM RealtimeIndicator").fetchall()
            IDKPI = [item[0] for item in IDKPI]
            KPItypes = []
            for kpi in IDKPI:
                types, IDP = curF2F.execute(
                    f"SELECT KPIType, IDP FROM Indicators WHERE IDKPI = '{kpi}'").fetchone()

                if types == "HU_DTL_Contenant":
                    STD = curF2F.execute(
                        f"SELECT Quantity FROM ProdVolume WHERE IDP = '{IDP}' AND Date = '{todayDate}'").fetchone()

                elif types == "Rework_list":
                    STD = curF2F.execute(
                        f"SELECT Quantity FROM ProdRework WHERE IDP = '{IDP}' AND Date = '{todayDate}'").fetchone()
                elif types == "Scrap_List":
                    STD = curF2F.execute(
                        f"SELECT Quantity FROM ProdScrap WHERE IDP = '{IDP}' AND Date = '{todayDate}'").fetchone()
                if STD == None:
                    STD = 0
                else:
                    STD = STD[0]

                curF2F.execute(
                    f"UPDATE RealtimeIndicator SET STDN1 = {STD}, STDN = {STD}, RRN1 = 'X', RRN= 'X', Action='' WHERE IDKPI = '{kpi}'")

                # VOLUME ALERT
                if types == "HU_DTL_Contenant":
                    target = curF2F.execute(
                        f"SELECT Target3H FROM Indicators WHERE IDKPI = '{kpi}'").fetchone()[0]
                    #print(STD)
                    #print(target)
                    #print(STD < target)
                    try:
                        if STD < target:
                            maxExpected = curF2F.execute(
                                f"SELECT MaxExpected FROM Indicators WHERE IDKPI = '{kpi}'").fetchone()[0]
                            # print(maxExpected)
                            #print(kpi)
                            curF2F.execute(
                                f"INSERT INTO AlerteTable (IDKPI, NumAction, MaxExpected) VALUES ('{kpi}', 1, {maxExpected})")
                            connF2F.commit()
                            #print(kpi)
                            state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = getAlertedKPIsPropsByID(
                                kpi, curF2F)

                            publishedDate = datetime.datetime.strptime(
                                publishedDate, f'%Y-%m-%d %H:%M:%S')
                            if expectedTime == None or expectedTime == "":
                                expectedTime = publishedDate + \
                                    datetime.timedelta(minutes=maxExpectedmin)
                                curF2F.execute(
                                    f"UPDATE AlerteTable SET ExpectedTime = '{expectedTime}' WHERE IDKPI = '{kpi}' AND NumAction = '{state}'")
                                connF2F.commit()
                    except(sqlite3.IntegrityError):
                        print(f"Existing Alert On: {kpi}")

                # HistIndicators
                criteria, critical = curF2F.execute(
                    f"SELECT Criteria, Critical FROM RealtimeIndicator WHERE IDKPI = '{kpi}'").fetchone()
                IDUAP = curF2F.execute(
                    f"SELECT IDUAP FROM ProUAP WHERE IDP = '{IDP}'").fetchone()[0]
                try:
                    #print(kpi, criteria, STD, currentDay, critical, IDUAP)
                    curF2F.execute(
                        f"INSERT INTO HistIndicators (IDKPI, Criteria, STD, Day, Critical, IDUAP) VALUES ('{kpi}', '{criteria}', '{STD}', '{currentDay}', {critical}, '{IDUAP}')")
                except(sqlite3.IntegrityError):
                   print(None)
                print('added to hitory')

                connF2F.commit()
                #print(STD)

        alertDetection(connF2F, curF2F, reworkInfoNew, reworkInfoOld, 'rework')
        t.sleep(1)

        alertDetection(connF2F, curF2F, scrapInfoNew, scrapInfoOld, 'scrap')
        t.sleep(1)

        scrapInfoOld = scrapInfoNew
        reworkInfoOld = reworkInfoNew
        oldTime = currentTime
        t.sleep(1)
