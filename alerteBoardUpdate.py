import sqlite3
import time as t
from UtilisF2FI import *
import datetime
import numpy as np

if __name__ == '__main__':
    connF2F, curF2F = connectDB()

    while True:
        IDKPIs = curF2F.execute(
            'SELECT DISTINCT IDKPI FROM AlerteTable').fetchall()
        IDKPIs = [item[0] for item in IDKPIs]
        now = datetime.datetime.now().strftime(f"%Y-%m-%d %H:%M:%S")
        now = datetime.datetime.strptime(now, f"%Y-%m-%d %H:%M:%S")
        print(now)
        for IDKPI in IDKPIs:
            state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = getAlertedKPIsPropsByID(IDKPI, curF2F)
            print(expectedTime)
            if expectedTime == None or expectedTime == "":
                    expectedTime = publishedDate + \
                        datetime.timedelta(minutes=maxExpectedmin)
                    curF2F.execute(
                        f"UPDATE AlerteTable SET ExpectedTime = '{expectedTime}' WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'")
                    connF2F.commit()
            else:
                # expectedTime = expectedTime + datetime.timedelta(minutes=60)
                print(onWait)
                # print(expectedTime + datetime.timedelta(minutes=60))
                if IDKPI == 'K005':
                    print(now)
                    print(expectedTime)
                    print(state)
                    print(expectedTime <= now and state < 3)
                    print(int(Validated) == 0)
                    print('______________')
                if expectedTime <= now and state < 3 and int(onWait) == 0 and int(Validated) == 0:
                    print(IDKPI)
                    print(state)
                    print(expectedTime)
                    print(now)
                    print('______________')
                    maxExpected = curF2F.execute(
                        f"SELECT MaxExpected FROM Indicators WHERE IDKPI = '{IDKPI}'").fetchone()[0]
                    curF2F.execute(
                        f"INSERT INTO AlerteTable (IDKPI, NumAction, Action, MaxExpected) VALUES ('{IDKPI}',  {state+1}, NULL, {maxExpected})")
                    connF2F.commit()
                    state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = getAlertedKPIsPropsByID(
                        IDKPI, curF2F)
                    
                    print(publishedDate)
                    publishedDate = str(publishedDate)
                    publishedDate = datetime.datetime.strptime(publishedDate, f'%Y-%m-%d %H:%M:%S')
                    #if expectedTime == None or expectedTime == "":
                    #    expectedTime = publishedDate + \
                    #        datetime.timedelta(minutes=maxExpectedmin)
                    #    curF2F.execute(
                    #        f"UPDATE AlerteTable SET ExpectedTime = '{expectedTime}' WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'")
                    #    connF2F.commit()

        t.sleep(2)
