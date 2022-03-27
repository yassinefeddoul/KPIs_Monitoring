# from datetime import datetime
#from ctypes import cast
import datetime
#import sqlite3
import numpy as np
#import matplotlib.pyplot as plt
import pyodbc


def connectDB():
    # connF2F = sqlite3.connect(src)
    # curF2F = connF2F.cursor()
    connF2F = pyodbc.connect('')
    curF2F = connF2F.cursor()
    
    return connF2F, curF2F


def getUserKPIs(userInfo, curF2F):
    IDUAP = curF2F.execute(
        f"SELECT IDUAP FROM Employes WHERE Email = '{userInfo['email']}'").fetchone()[0]
    if userInfo['status'] == 'Superviseur':
        IDPs = curF2F.execute(
            f"SELECT IDP FROM ProSup WHERE Email = '{userInfo['email']}'").fetchall()
        IDPs = tuple([item[0] for item in IDPs])
        #print(IDPs)
        if len(IDPs) == 1:
            IDPs = IDPs[0]
            IDKPIs = curF2F.execute(
                f"SELECT RealtimeIndicator.IDKPI FROM (RealtimeIndicator INNER JOIN Indicators on RealtimeIndicator.IDKPI = Indicators.IDKPI) WHERE IDP = '{IDPs}'").fetchall()
            if len(IDKPIs) != 0:
                IDKPIs = IDKPIs[0]
                if len(IDKPIs) == 1:
                    IDKPIs = "('"+IDKPIs[0]+"')"
                    return {'Alert': False, 'IDKPIs': IDKPIs}
                else:
                    IDKPIs = [item[0] for item in IDKPIs]
                    IDKPIs = tuple(IDKPIs)
                    return {'Alert': False, 'IDKPIs': IDKPIs}
            else:
                return {'Alert': True, 'message': f"{userInfo['fullName']} Don't have KPIs at this moment"}
        else:
            IDKPIs = curF2F.execute(
                f"SELECT RealtimeIndicator.IDKPI FROM (RealtimeIndicator INNER JOIN Indicators on RealtimeIndicator.IDKPI = Indicators.IDKPI) WHERE IDP IN {IDPs}").fetchall()
            IDKPIs = [item[0] for item in IDKPIs]
            if len(IDKPIs) == 1:
                IDKPIs = "('"+IDKPIs[0]+"')"
            else:
                IDKPIs = tuple(IDKPIs)
            return {'Alert': False, 'IDKPIs': IDKPIs}

    elif userInfo['status'] == 'Manager':
        IDPs = curF2F.execute(
            f"SELECT IDP FROM ProUAP WHERE IDUAP = '{IDUAP}'")
        IDPs = tuple([item[0] for item in IDPs])
        if len(IDPs) == 1:
            IDPs = IDPs[0]
            IDKPIs = curF2F.execute(
                f"SELECT RealtimeIndicator.IDKPI FROM (RealtimeIndicator INNER JOIN Indicators on RealtimeIndicator.IDKPI = Indicators.IDKPI) WHERE IDP = '{IDPs}'").fetchone()
            if IDKPIs != None:
                IDKPIs = IDKPIs[0]
                if len(IDKPIs) == 1:
                    IDKPIs = "('"+IDKPIs[0]+"')"
                    return {'Alert': False, 'IDKPIs': IDKPIs}
                else:
                    IDKPIs = [item[0] for item in IDKPIs]
                    IDKPIs = tuple(IDKPIs)
                    return {'Alert': False, 'IDKPIs': IDKPIs}
            else:
                return {'Alert': True, 'message': f"{userInfo['fullName']} don't have KPIs at this moment"}
        else:
            IDKPIs = curF2F.execute(
                f'SELECT RealtimeIndicator.IDKPI FROM (RealtimeIndicator INNER JOIN Indicators on RealtimeIndicator.IDKPI = Indicators.IDKPI) WHERE IDP IN {IDPs}')
            IDKPIs = [item[0] for item in IDKPIs]
            if len(IDKPIs) == 1:
                IDKPIs = "('"+IDKPIs[0]+"')"
            else:
                IDKPIs = tuple(IDKPIs)
            return {'Alert': False, 'IDKPIs': IDKPIs}

    elif userInfo['status'] == 'Director' or userInfo['status'] == 'Deputy Manager' or userInfo['status'] == 'FES':
        IDKPIs = curF2F.execute(
            f"SELECT IDKPI FROM RealTimeIndicator").fetchall()
        IDKPIs = [item[0] for item in IDKPIs]
        if len(IDKPIs) == 1:
            IDKPIs = "('"+IDKPIs[0]+"')"
        else:
            IDKPIs = tuple(IDKPIs)
        return {'Alert': False, 'IDKPIs': IDKPIs}


def getAlertedKPIsProps(KPIName, curF2F):
    IDKPI = curF2F.execute(
        f"SELECT IDKPI FROM Indicators WHERE KPIName = '{KPIName}'").fetchone()[0]
    state = curF2F.execute(
        f"SELECT max(NumAction) FROM AlerteTable WHERE IDKPI = '{IDKPI}'").fetchone()[0]
    action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = curF2F.execute(
        f"SELECT Action, DateHour, MaxExpected, OnWait, Validated, ExpectedTime FROM AlerteTable WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'").fetchall()[0]
    # if expectedTime != None:
    #     expectedTime = datetime.datetime.strptime(
    #         expectedTime, f"%Y-%m-%d %H:%M:%S")
    return IDKPI, state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime


def getAlertedKPIsPropsByID(IDKPI, curF2F):
    state = curF2F.execute(
        f"SELECT max(NumAction) FROM AlerteTable WHERE IDKPI = '{IDKPI}'").fetchone()[0]
    action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = curF2F.execute(f"SELECT Action, DateHour, MaxExpected, OnWait, Validated, ExpectedTime FROM AlerteTable WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'").fetchall()[0]
    # if expectedTime != None:
    #     expectedTime = datetime.datetime.strptime(
    #         expectedTime, f"%Y-%m-%d %H:%M:%S")

    # print("----", expectedTime, "-----")
    return state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime


def fillProdData(connF2F, curF2F, connMII, curMII, dataType='volume'):
    if dataType == 'volume':
        WORKCENTERID = 'WORKCENTER'
        PRODUCTION_DATE = 'PRODUCTION_DATE'
        QTY = 'QTY'
        MIITABLE = 'HU_DTL_Contenant'
        F2FTABLE = 'ProdVolume'
    elif dataType == 'rework':
        WORKCENTERID = 'WORK_CENTER_ID'
        PRODUCTION_DATE = 'DATE_REWORK'
        QTY = 'QUANTITY'
        MIITABLE = 'Rework_list'
        F2FTABLE = 'ProdRework'
    elif dataType == 'scrap':
        WORKCENTERID = 'WORK_CENTER_ID'
        PRODUCTION_DATE = 'DATE'
        QTY = 'QUANTITY'
        MIITABLE = 'Scrap_List'
        F2FTABLE = 'ProdScrap'

    lastDateMII = curMII.execute(
        f'SELECT {PRODUCTION_DATE} FROM {MIITABLE} ORDER BY ROWID DESC LIMIT 1').fetchone()[0]
    lastDateMII = lastDateMII[:19]
    lastDateMII = datetime.datetime.strptime(
        lastDateMII, f"%Y-%m-%d %H:%M:%S").date()

    lastDateF2F = curF2F.execute(
        f'SELECT max(Date) FROM {F2FTABLE}').fetchone()[0]
    print(lastDateF2F, lastDateMII)

    if lastDateF2F == None:
        # lastDateF2F = lastDateMII
        lastDateF2F = datetime.datetime.strptime(
            '2017-02-06', f"%Y-%m-%d").date()
    else:
        # Conversion from DATETIME to DATE
        lastDateF2F = datetime.datetime.strptime(
            lastDateF2F, f"%Y-%m-%d").date()

    IDPs = curF2F.execute(f'SELECT IDP FROM Project').fetchall()
    IDPs = [item[0] for item in IDPs]
    QTYlist = np.zeros((1, len(IDPs)))[0]

    WCIDs = []
    for IDP in IDPs:
        WCs = curF2F.execute(
            f"SELECT WCID FROM ProWC WHERE IDP = '{IDP}'").fetchall()
        WCs = [item[0] for item in WCs]
        WCIDs.append(WCs)

    if lastDateMII == lastDateF2F:
        # UPDATING The Final Date in F2F
        miiData = curMII.execute(
            f"SELECT {WORKCENTERID}, {QTY} FROM {MIITABLE} WHERE {PRODUCTION_DATE} LIKE '{lastDateMII}%'").fetchall()
        for data in miiData:
            for i, wcids in enumerate(WCIDs):
                if data[0] in wcids:
                    QTYlist[i] += data[1]

        curF2F.execute(
            f"DELETE FROM {F2FTABLE} WHERE DATE = '{lastDateF2F}'")
        connF2F.commit()
        for i in range(len(IDPs)):
            if QTYlist[i] == 0:
                continue
            else:
                curF2F.execute(
                    f"INSERT INTO {F2FTABLE} (IDP, Quantity, DATE) VALUES ('{IDPs[i]}', {QTYlist[i]}, '{lastDateF2F}')")
                connF2F.commit()

    if lastDateMII > lastDateF2F:
        while lastDateF2F <= lastDateMII:
            QTYlist = np.zeros((1, len(IDPs)))[0]
            miiData = curMII.execute(
                f"SELECT {WORKCENTERID}, {QTY} FROM {MIITABLE} WHERE {PRODUCTION_DATE} LIKE '{lastDateF2F}%'").fetchall()

            for data in miiData:
                for i, wcids in enumerate(WCIDs):
                    if data[0] in wcids:
                        QTYlist[i] += data[1]
            curF2F.execute(
                f"DELETE FROM {F2FTABLE} WHERE DATE = '{lastDateF2F}'")
            connF2F.commit()
            for i in range(len(IDPs)):
                if QTYlist[i] == 0:
                    continue
                else:
                    curF2F.execute(
                        f"INSERT INTO {F2FTABLE} (IDP, Quantity, DATE) VALUES ('{IDPs[i]}', {QTYlist[i]}, '{lastDateF2F}')")
                    connF2F.commit()

            lastDateF2F = lastDateF2F + datetime.timedelta(days=1)


def alertDetection(connF2F, curF2F, newInfo, oldInfo, dataType='scrap'):
    if dataType == 'scrap':
        F2FTABLE = 'ProdScrap'
        KPIType = 'Scrap_List'
    elif dataType == 'rework':
        F2FTABLE = 'ProdRework'
        KPIType = 'Rework_list'
    oldInfo = [tuple(elm) for elm in oldInfo]
    newInfo = [tuple(elm) for elm in newInfo]
    #print(oldInfo)
    newInfo = {row for row in newInfo}
    diffA = list(set(oldInfo) - set(newInfo))
    diffB = list(set(newInfo) - set(oldInfo))
    #print(diffA)
    #print(diffB)
    IDPB = [item[0] for item in diffB]
    IDPA = [item[0] for item in diffA]
    alertedIDPs = []

    if len(diffA) != 0 or len(diffB) != 0:
        for elm in diffB:
            if elm[0] in IDPA:
                index = IDPA.index(elm[0])
                if elm[1] > diffA[index][1]:
                    alertedIDPs.append(elm)
            else:
                alertedIDPs.append(elm)
        realtimealert = curF2F.execute(
            f"SELECT DISTINCT IDKPI FROM AlerteTable").fetchall()
        realtimealert = [item[0] for item in realtimealert]
        if len(alertedIDPs) != 0:
            for idp in alertedIDPs:
                #print(idp[0], KPIType, '-------------')
                IDKPI = curF2F.execute(
                    f"SELECT RealtimeIndicator.IDKPI FROM (RealtimeIndicator INNER JOIN Indicators on RealtimeIndicator.IDKPI = Indicators.IDKPI) WHERE IDP = '{idp[0]}' AND KPIType = '{KPIType}'").fetchone()
                #print('new KPI', IDKPI)
                if IDKPI != None:
                    IDKPI = IDKPI[0]
                    exist = curF2F.execute(
                        f"SELECT DISTINCT IDKPI FROM AlerteTable WHERE IDKPI IN ('{IDKPI}')").fetchone()
                    #print('Existance', exist)
                    if exist == None:
                        print('not exist', IDKPI)
                        maxExpected = curF2F.execute(
                            f"SELECT MaxExpected FROM Indicators WHERE IDKPI = '{IDKPI}'").fetchone()[0]
                        curF2F.execute(
                            f"INSERT INTO AlerteTable (IDKPI, NumAction, MaxExpected) VALUES('{IDKPI}', 1, {maxExpected})")
                        connF2F.commit()
                        #print('_________________ INSERTED ', IDKPI)
                        state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = getAlertedKPIsPropsByID(
                            IDKPI, curF2F)
                        # print(publishedDate)
                        # publishedDate = datetime.datetime.strptime(
                        #     publishedDate, f'%Y-%m-%d %H:%M:%S')
                        if expectedTime == None or expectedTime == "":
                            expectedTime = publishedDate + \
                                datetime.timedelta(minutes=maxExpectedmin)
                            curF2F.execute(
                                f"UPDATE AlerteTable SET ExpectedTime = '{expectedTime}' WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'")
                            connF2F.commit()


# def plot_series(time, series, format="-", start=0, end=None):
#     plt.plot(time[start:end], series[start:end], format)
#     plt.xlabel("Time")
#     plt.ylabel("Value")
#     plt.grid(True)


def windowed_dataset(series, window_size, batch_size=32, shuffle_buffer=1000):
    dataset = tf.data.Dataset.from_tensor_slices(series)
    dataset = dataset.window(window_size + 1, shift=1, drop_remainder=True)
    dataset = dataset.flat_map(lambda window: window.batch(window_size + 1))
    dataset = dataset.shuffle(shuffle_buffer).map(
        lambda window: (window[:-1], window[-1]))
    dataset = dataset.batch(batch_size).prefetch(1)
    return dataset


def forecast(model, series, window_size):
    # forecast = []
    series = np.array(series)

    # for time in range(len(series) - window_size):
    #     forecast.append(model.predict(
    #         series[time:time + window_size][np.newaxis]))

    # plt.figure(figsize=(10, 6))

    # Prediction of the next week
    lastWindow = series[len(series)-window_size:]
    # lastWindowlist = list(lastWindow)

    nextWeekForecast = []
    for time in range(7):
        nextWeekForecast.append(model.predict(
            lastWindow[time:time + window_size][np.newaxis]))
        prediction = model.predict(
            lastWindow[time:time + window_size][np.newaxis])[0, 0]
        lastWindow = np.append(lastWindow, prediction)

    nextWeekForecast = list(np.array(nextWeekForecast)[:, 0, 0])
    nextWeekForecast = [int(item) for item in nextWeekForecast]

    return nextWeekForecast
