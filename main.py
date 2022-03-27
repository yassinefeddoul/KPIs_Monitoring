#from os import SEEK_CUR, curdir
#import sqlite3
#from sqlite3.dbapi2 import Row, connect
#from typing import NewType
from pickle import APPEND
import numpy as np
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import datetime
# import pandas as pd
from UtilisF2FI import *

app = Flask(__name__)
CORS(app)


@app.route('/authentification', methods=['POST'])
def authentification():
    req = request.get_json()
    email = req['email']
    password = req['password']
    conn, cur = connectDB()
    cur.execute('SELECT Email FROM Employes')
    all_emails = cur.fetchall()
    emails = []
    data = {'alert': 'None'}
    for elm in all_emails:
        emails.append(list(elm)[0])

    if email in emails:
        query = f"SELECT Password FROM Employes WHERE Email = '{email}';"
        cur.execute(query)
        result_password = cur.fetchone()[0]
        if result_password == '0':
            data = {'alert': "True",
                    'message': "New user"}
        elif result_password == password:
            cur.execute(
                f"SELECT Status FROM Employes WHERE Email='{email}';")

            result_status = cur.fetchone()[0]

            fullName = cur.execute(
                f"SELECT UserName FROM Employes WHERE Email = '{email}';"
            ).fetchone()[0]
            UAP = cur.execute(
                f"SELECT NomUAP FROM Employes inner join UAP On Employes.IDUAP = UAP.IDUAP WHERE Email='{email}';"
            ).fetchone()[0]

            data = {'alert': 'False',
                    'message': 'None',
                    'email': email,
                    'lastConnection': datetime.datetime.today().date(),
                    'password': password,
                    'status': result_status,
                    'fullName': fullName,
                    'UAP': UAP}
        elif result_password != password:
            data = {'alert': 'True',
                    'message': 'Wrong Password !!'}
    else:
        data = {'alert': "True",
                'message': "Email Invalide !!"}
    return data


@app.route('/createPassword', methods=['POST'])
def createPassword():
    req = request.get_json()
    email = req['email']
    newPassword = req['newPassword']
    conn, cur = connectDB()
    query = f"UPDATE Employes SET Password = '{newPassword}' WHERE Email = '{email}';"
    cur.execute(query)
    conn.commit()
    return {'message': 'password updated'}


@app.route('/loadF2F', methods=['POST'])
def loadF2F():
    req = request.get_json()
    userInfo = req['userInfo']
    connF2F, curF2F = connectDB()
    message = getUserKPIs(userInfo, curF2F)
    if message['Alert'] == False:
        IDKPItuple = message['IDKPIs']

        # print(IDKPItuple)
        infos = curF2F.execute(
            f"SELECT RealtimeIndicator.IDKPI, KPIName, RealtimeIndicator.Criteria, STDN1, RRN1, RRN, Action FROM (RealtimeIndicator INNER JOIN Indicators on RealtimeIndicator.IDKPI=Indicators.IDKPI) WHERE RealtimeIndicator.IDKPI IN {IDKPItuple}").fetchall()
        # IDKPI = [item[0] for item in IDName]
        # KPIName = [item[1] for item in IDName]

        IDKPI = [item[0] for item in infos]
        KPIName = [item[1] for item in infos]
        criteria = [item[2] for item in infos]
        STD = [item[3] for item in infos]
        RRN1 = [item[4] for item in infos]
        RRN = [item[5] for item in infos]
        Action = [item[6] for item in infos]

        #print(IDKPItuple)
        #print(infos)
        jsonList = []
        for i in range(len(IDKPI)):
            row = {'IDKPI': IDKPI[i],
                   'KPIName': KPIName[i],
                   'Criteria': criteria[i],
                   'STD': STD[i],
                   'Action': Action[i],
                   'RRN1': RRN1[i],
                   'RRN': RRN[i]}
            jsonList.append(row)
        return jsonify(jsonList)
    else:
        return jsonify([])


@app.route('/saveF2FChange', methods=['POST'])
def saveF2FChange():
    req = request.get_json()
    connF2F, curF2F = connectDB()
    currentDate = datetime.datetime.now().strftime(f"%Y-%m-%d")
    for i in range(len(req)):
        IDKPI = req[i]['IDKPI']
        RRN1 = req[i]['RRN1']
        RRN = req[i]['RRN']

        curF2F.execute(
            f"UPDATE RealtimeIndicator SET RRN1='{RRN1}', RRN='{RRN}' WHERE IDKPI='{IDKPI}'")

        curF2F.execute(
            f"UPDATE HistIndicators SET RR = '{RRN}' WHERE IDKPI = '{IDKPI}' AND Date = '{currentDate}'")

        connF2F.commit()

    return {'message': 'Updated Successfully'}


@app.route('/loadAlertBoardData', methods=['POST'])
def loadAlertBoardData():
    userInfo = request.get_json()

  
    connF2F, curF2F = connectDB()

    # get ID UAP:
    IDUAP = curF2F.execute(
        f"SELECT IDUAP FROM UAP WHERE NomUAP = '{userInfo['UAP']}'").fetchone()[0]
    # print(IDUAP)
    # print(userInfo['UAP'])
    # print(userInfo['status'])
    # if userInfo['status'] == 'Manager' or userInfo['status'] == 'Superviseur':
    #print(userInfo)
    userKPIs = getUserKPIs(userInfo, curF2F)
    #print(userKPIs['Alert'])
    if userKPIs['Alert'] == True:
        return {'Alert': 'True', 'message': userKPIs['message']}
    else:
        # SELECT KPIs in Alert
        # IDKPIs = tuple(userKPIs['IDKPIs'])
        # print(IDKPIs)
        IDKPIs = userKPIs['IDKPIs']
        alertedKPI = curF2F.execute(
            f"SELECT DISTINCT AlerteTable.IDKPI, KPIName FROM (AlerteTable INNER JOIN Indicators on Indicators.IDKPI = AlerteTable.IDKPI) WHERE AlerteTable.IDKPI IN {IDKPIs}").fetchall()
        alertedKPIName = [item[1] for item in alertedKPI]
        #print(alertedKPIName)
        # print(alertedKPIName)
        liste = []
        for elm in alertedKPIName:
            row = {'alertedKPI': elm}
            liste.append(row)
        return jsonify(liste)

    


@app.route('/loadAlertedKPIData', methods=['POST'])
def loadAlertedKPIData():
    KPIName = request.get_json()['selectedKPI']
    
    connF2F, curF2F = connectDB()

    # Propreties Determination
    IDKPI = curF2F.execute(
        f"SELECT IDKPI FROM Indicators WHERE KPIName = '{KPIName}'").fetchone()[0]
    state = curF2F.execute(
        f"SELECT max(NumAction) FROM AlerteTable WHERE IDKPI = '{IDKPI}'").fetchone()[0]
    action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = curF2F.execute(
        f"SELECT Action, DateHour, MaxExpected, OnWait, Validated, ExpectedTime FROM AlerteTable WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'").fetchall()[0]

    # publishedDate = datetime.datetime.strptime(
    #     publishedDate, f'%Y-%m-%d %H:%M:%S')
   

    return {'IDKPI': IDKPI,
            'state': state,
            'action': action,
            'publishedDate': publishedDate,
            'maxExpected': maxExpectedmin,
            'expectedTime': expectedTime,
            'onWait': onWait,
            'Validated': Validated}


@app.route('/takeAction', methods=['POST'])
def takeAction():
    data = request.get_json()
    actionToTake = data['action']
    KPIName = data['KPIname']
    state = int(data['state'])
    status = data['status']

    
    connF2F, curF2F = connectDB()

    IDKPI, state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = getAlertedKPIsProps(
        KPIName, curF2F)
  
    if status == 'Superviseur':
        status = 1
    elif status == 'Manager':
        status = 2
    elif status == 'Director':
        status = 3
    if status != state:
        #print('impossible')
        #print('---------------------------------------')
        return {'Alert': 'True', 'message': 'You have no right to take this action !!'}
    else:
        curF2F.execute(f"""UPDATE AlerteTable SET Action = '{actionToTake}' WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'""")
        connF2F.commit()

        curF2F.execute(f"""UPDATE RealtimeIndicator SET Action = '{actionToTake}' WHERE IDKPI = '{IDKPI}';""")

        currentDate = datetime.datetime.now().strftime(f"%Y-%m-%d")
        curF2F.execute(
            f"UPDATE HistIndicators SET Action = '{actionToTake}' WHERE Date = '{currentDate}'")
        connF2F.commit()
        print(publishedDate)
        # publishedDate = datetime.datetime.strptime(publishedDate, f'%Y-%m-%d %H:%M:%S').date()
        expectedTime = expectedTime.time()

        return {'Alert': 'False', 'state': state, 'expectedTime': str(expectedTime), 'dateHour': str(publishedDate)}


@app.route('/onWaitAlert', methods=['POST'])
def onWaitAlert():
    data = request.get_json()
    onWait = data['onWait']
    KPIName = data['KPIName']

    connF2F, curF2F = connectDB()
    IDKPI, state, action, publishedDate, maxExpectedmin, onWaitold, Validated, expectedTime = getAlertedKPIsProps(
        KPIName, curF2F)

    if onWait == 1:
        curF2F.execute(
            f"UPDATE AlerteTable SET OnWait = {onWait} WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'")

    elif onWait == 0:
        curF2F.execute(
            f"UPDATE AlerteTable SET OnWait = {onWait} WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'")

    connF2F.commit()
    return {'message': onWait}


@app.route('/validatedAlert', methods=['POST'])
def validatedAlert():
    data = request.get_json()
    validated = data['validate']
    KPIName = data['KPIName']

    connF2F, curF2F = connectDB()
    IDKPI, state, action, publishedDate, maxExpectedmin, onWaitold, Validated, expectedTime = getAlertedKPIsProps(
        KPIName, curF2F)

    if validated == 1:
        curF2F.execute(
            f"UPDATE AlerteTable SET Validated = {validated} WHERE IDKPI = '{IDKPI}' AND NumAction = '{state}'")
        connF2F.commit()
        validatedKPIs = curF2F.execute(
            f"SELECT * FROM AlerteTable WHERE IDKPI = '{IDKPI}'").fetchall()
        # print(validatedKPIs)
        # print(type(validatedKPIs))
        # validatedKPI = []
        # print(type(validatedKPI))
        for validatedKPI in validatedKPIs:
            # print(validateKKPI)
            # print(type(validatedKPI))
            print(validatedKPI)
            validatedKPI = list(validatedKPI)
            # validateKPI = [item for item in validateKPI]
            # print(validatedKPI[0])
            # print(validatedKPI[2])

            # validatedKPI[3] = datetime.datetime.strptime(validatedKPI[3], f'%Y-%m-%d %H:%M:%S').date()
            # validatedKPI[4] = datetime.datetime.strptime(validatedKPI[4], f'%Y-%m-%d %H:%M:%S').date()

            validatedKPI[3] = str(validatedKPI[3])
            validatedKPI[4] = str(validatedKPI[4])

            if None in validatedKPI:
                index = validatedKPI.index(None)
                validatedKPI = list(validatedKPI)
                validatedKPI[index] = 'NULL'
            
            validatedKPI = tuple(validatedKPI)
            curF2F.execute(f"INSERT INTO AlerteTableHist (IDKPI, NumAction, Action, DateHour, ExpectedTime, MaxExpected, Validated, OnWait) VALUES {validatedKPI}")
            connF2F.commit()

        curF2F.execute(f"DELETE FROM AlerteTable WHERE IDKPI = '{IDKPI}'")
        connF2F.commit() 
        # curF2F.execute(f"DELETE FROM AlerteTable WHERE IDKPI = '{IDKPI}'")
    return {'message': 'UPDATED Validation'}


@app.route('/fillAlertSheet', methods=['POST'])
def fillAlertSheet():
    KPIName = request.get_json()['selectedKPI']

    connF2F, curF2F = connectDB()

    IDKPI, state, action, publishedDate, maxExpectedmin, onWait, Validated, expectedTime = getAlertedKPIsProps(
        KPIName, curF2F)
    alertedKPIData = curF2F.execute(
        f"SELECT Action, ExpectedTime, DateHour, NumAction FROM AlerteTable WHERE IDKPI = '{IDKPI}'").fetchall()
    alertedKPIData
    jsonlist = []
    for data in alertedKPIData:
        expected = data[1].time()
        date = data[2].date()
        row = {'action': data[0], 'expectedTime': str(expected),
               'dateHour': str(date), 'state': data[3]}
        jsonlist.append(row)
    return jsonify(jsonlist)


@app.route('/manConKPItofollow', methods=['POST'])
def manConKPItofollow():
    connF2F, curF2F = connectDB()
    req = request.get_json()
    UAP = req['UAP']
    Proj = req['project']
    Ind = req['indicator']
    all_UAP = []
    all_Project = []
    all_KPIs = []

    UAPs = curF2F.execute('SELECT NomUAP FROM UAP').fetchall()
    all_UAP = [item[0] for item in UAPs]
    data = {
        'UAP': all_UAP,
        'Projects': [],
        'Indicators': []
    }
    #print(UAP, "-------")
    if UAP != "" and Ind == "":
        IDUAP = curF2F.execute(f"SELECT IDUAP FROM UAP WHERE NomUAP = '{UAP}';").fetchone()[0]

        IDPs = curF2F.execute(f"SELECT IDP FROM ProUAP WHERE IDUAP = '{IDUAP}';").fetchall()
        IDPs = [item[0] for item in IDPs]
        for idp in IDPs:
            projet = curF2F.execute(f"SELECT ProjectName FROM Project WHERE IDP = '{idp}';").fetchone()[0]
            all_Project.append(projet)
        data = {
            'UAP': all_UAP,
            'Projects': all_Project,
            'Indicators': []
        }
    if UAP != "" and Proj != "" and Ind == "":
        IDP = curF2F.execute(f"SELECT IDP FROM Project WHERE ProjectName = '{Proj}';").fetchone()[0]

        KPINames = curF2F.execute(f"SELECT KPIName FROM Indicators WHERE IDP = '{IDP}';").fetchall()
        all_KPIs = [item[0] for item in KPINames]

        data = {
            'UAP': UAP,
            'Projects': Proj,
            'Indicators': all_KPIs
        }
    #print(data)
    return data


@app.route('/submitRealtimeKPI', methods=['POST'])
def submitRealtimeKPI():
    req = request.get_json()
    connF2F, curF2F = connectDB()
    realtimeKPI = req['rtList']
    print(realtimeKPI)
    # CHECKING PHASE
    existingKPIs = curF2F.execute(
        f"SELECT IDKPI FROM RealtimeIndicator").fetchall()
    existingKPIs = [item[0] for item in existingKPIs]

    newIDKPI = []
    for kpi in realtimeKPI:
        try:
            idkpi = curF2F.execute(
                f"SELECT IDKPI FROM Indicators WHERE KPIName = '{kpi[0]}'").fetchone()[0]
            newIDKPI.append(idkpi)
            criteria = curF2F.execute(
                f"SELECT Criteria FROM Indicators WHERE KPIName = '{kpi[0]}'").fetchone()[0]
            # print(idkpi, criteria)

            curF2F.execute(
                f"INSERT INTO RealtimeIndicator (IDKPI, Criteria, Critical) VALUES ('{idkpi}', '{criteria}', {kpi[1]})")
        except(pyodbc.IntegrityError):
            curF2F.execute(
                f"UPDATE RealtimeIndicator SET Critical = {kpi[1]} WHERE IDKPI = '{idkpi}'")
        connF2F.commit()

    deletedKPI = list(set(existingKPIs) - set(newIDKPI))
    if len(deletedKPI) != 0:
        for idkpi in deletedKPI:
            curF2F.execute(
                f"DELETE FROM RealtimeIndicator WHERE IDKPI = '{idkpi}'")
    connF2F.commit()

    return {'message': 'Updated Successfully'}


@app.route('/loadRealtimeKPI', methods=['POST'])
def loadRealtimeKPI():
    connF2F, curF2F = connectDB()
    req = request.get_json()
    IDKPIs = curF2F.execute(f"SELECT IDKPI FROM RealtimeIndicator").fetchall()
    IDKPIs = tuple([item[0] for item in IDKPIs])
    if len(IDKPIs) == 1:
        IDKPIs = IDKPIs[0]
        KPIname = curF2F.execute(
            f"SELECT KPIName FROM Indicators WHERE IDKPI = '{IDKPIs}'").fetchone()[0]
        critical = curF2F.execute(
            f"SELECT Critical FROM RealtimeIndicator WHERE IDKPI = '{IDKPIs}'").fetchone()[0]
        critical = [critical]
    else:
        #print(IDKPIs)
        KPIname = curF2F.execute(
            f"SELECT KPIName FROM Indicators WHERE IDKPI IN {IDKPIs}").fetchall()
        KPIname = [item[0] for item in KPIname]
        critical = curF2F.execute(
            f"SELECT Critical FROM RealtimeIndicator WHERE IDKPI IN {IDKPIs}").fetchall()
        critical = [item[0] for item in critical]
    #print(critical)
    return {'KPIname': KPIname, 'criticals': critical}


@app.route('/submitNewEmploye', methods=['POST'])
def submitNewEmploye():
    connF2F, curF2F = connectDB()
    data = request.get_json()
    email = data['newEmail']
    username = data['userName']
    status = data['status']
    uapName = data['UAP']
    departement = data['departement']
    IDUAP = curF2F.execute(
        f"SELECT IDUAP FROM UAP WHERE NomUAP = '{uapName}'").fetchone()[0]
    try:
        curF2F.execute(
            f"INSERT INTO Employes (Email, UserName, Status, IDUAP, Departement) VALUES('{email}', '{username}', '{status}', '{IDUAP}', '{departement}')")
        connF2F.commit()
        return {'Alert': 'False', 'message': 'Updated Successfully !'}
    except(pyodbc.IntegrityError):
        return {'Alert': 'True', 'message': 'This employe already exist !'}


@app.route('/loadingInfos', methods=['POST'])
def projectList():
    data = request.get_json()
    _, curF2F = connectDB()

    projectName = curF2F.execute(f"SELECT ProjectName FROM Project").fetchall()
    projectName = [item[0] for item in projectName]

    supervisorEmail = curF2F.execute(
        f"SELECT Email FROM Employes WHERE Status = 'Superviseur'").fetchall()
    supervisorEmail = [item[0] for item in supervisorEmail]

    sheetDates = curF2F.execute(
        f"SELECT DISTINCT Date FROM HistIndicators").fetchall()
    sheetDates = [item[0] for item in sheetDates]

    maxSheetDate = curF2F.execute(
        f"SELECT MAX(Date) FROM HistIndicators").fetchall()
    maxSheetDate = [item[0] for item in maxSheetDate]
    return {'projectList': projectName, 'supervisorsList': supervisorEmail, 'sheetDates': sheetDates, 'maxSheetDate': maxSheetDate}


@app.route('/submitNewIndicator', methods=['POST'])
def submitNewIndicator():
    data = request.get_json()
    connF2F, curF2F = connectDB()

    KPIName = data['KPIName']
    criteria = data['criteria']
    KPItype = data['KPItype']
    target = data['target']
    project = data['project']
    maxExpected = data['maxExpected']

    if KPItype == 'Volume':
        KPItype = 'HU_DTL_Contenant'
    if KPItype == 'Rework':
        KPItype = 'Rework_list'
    if KPItype == 'Scrap':
        KPItype = 'Scrap_List'

    IDP = curF2F.execute(
        f"SELECT IDP FROM Project WHERE ProjectName = '{project}'").fetchone()[0]
    IDPKPI = curF2F.execute("SELECT IDP, KPIType FROM Indicators").fetchall()
    newIDKPI = (IDP, KPItype)
    if newIDKPI in IDPKPI:
        return {'Alert': 'True', 'message': 'This Indicator already exist'}
    else:
        maxIDKPI = curF2F.execute(
            f"SELECT MAX(IDKPI) FROM Indicators").fetchone()[0]
        maxIDKPI = str(int(maxIDKPI[1:]) + 1)
        if len(maxIDKPI) != 3:
            maxIDKPI = "K0"+maxIDKPI
        else:
            maxIDKPI = "K"+maxIDKPI

        curF2F.execute(
            f"INSERT INTO Indicators (IDKPI, KPIName, Criteria, IDP, KPIType, MaxExpected, Target3H) VALUES ('{maxIDKPI}', '{KPIName}', '{criteria}', '{IDP}', '{KPItype}', '{maxExpected}', {target})")
        connF2F.commit()
        return {'Alert': 'False', "message": 'Updated Successfully'}


@app.route('/submitNewProject', methods=['POST'])
def submitNewProject():
    data = request.get_json()
    connF2F, curF2F = connectDB()

    projectName = data['projectName']
    UAP = data['UAP']
    IDUAP = curF2F.execute(
        f"SELECT IDUAP FROM UAP WHERE NomUAP = '{UAP}'").fetchone()[0]
    WCIDs = data['WCIDs']
    emailSup = data['EmailSup']

    exisitingWCIDs = curF2F.execute(f"SELECT WCID FROM ProWC").fetchall()
    exisitingWCIDs = [item[0] for item in exisitingWCIDs]

    diffWC = list(set(WCIDs) - set(exisitingWCIDs))
    if len(diffWC) < len(WCIDs):
        return {'Alert': 'True', 'message': 'Some WORKCENTER IDs already exist'}
    else:
        maxIDP = curF2F.execute(f"SELECT MAX(IDP) FROM Project").fetchone()[0]
        maxIDP = str(int(maxIDP[1:]) + 1)
        if len(maxIDP) != 3:
            maxIDP = "P0"+maxIDP
        else:
            maxIDP = "P"+maxIDP
        #print(maxIDP)

        # AJOUT DANS PROJECT
        curF2F.execute(
            f"INSERT INTO Project (IDP, ProjectName) VALUES ('{maxIDP}', '{projectName}')")

        # AJOUT DES WC DANS PROSUP
        for wcid in WCIDs:
            curF2F.execute(
                f"INSERT INTO ProWC (IDP, WCID) VALUES ('{maxIDP}', '{wcid}')")

        # AJOUT DANS PROUAP
        curF2F.execute(
            f"INSERT INTO ProUAP (IDP, IDUAP) VALUES ('{maxIDP}', '{IDUAP}')")

        # AJOUT DANS prosup
        for email in emailSup:
            curF2F.execute(
                f"INSERT INTO ProSup (IDP, Email) VALUES ('{maxIDP}', '{email}')")

        # connF2F.commit()
        return {'message': 'Updated Succefully'}


@app.route('/loadTourSheet', methods=['POST'])
def loadTourSheet():
    req = request.get_json()
    dateDiff = 0
    selectedDate = req['selectedDate']
    connF2F, curF2F = connectDB()
    print(selectedDate)
    currentDate = datetime.datetime.now().strftime(f"%Y-%m-%d")
    print(f"SELECT IDUAP, Count(IDUAP) FROM HistIndicators WHERE Critical = 1 AND Date = CAST('{selectedDate}' as Date) GROUP BY IDUAP")
    # currentDate = "2022-01-01"
    if currentDate != selectedDate:
        dateDiff = 1
    #print('date Diff ', dateDiff)
    #print(selectedDate)
    infoUAP = curF2F.execute(
        f"SELECT IDUAP, Count(IDUAP) FROM HistIndicators WHERE Critical = 1 AND Date = CAST('{selectedDate}' as Date) GROUP BY IDUAP").fetchall()
    #print(selectedDate)
    #print(infoUAP)
    IDUAP = [item[0] for item in infoUAP]
    infoUAPG = []
    for info in infoUAP:
        name = curF2F.execute(
            f"SELECT NomUAP FROM UAP WHERE IDUAP = '{info[0]}'").fetchone()[0]
        infoUAPG.append((info[0], info[1], name))

    tourInfo = curF2F.execute(
        f"SELECT KPIName, HistIndicators.Criteria, HistIndicators.STD_Dir, HistIndicators.RR_Dir, HistIndicators.IDUAP, HistIndicators.Comment, HistIndicators.IDKPI FROM (HistIndicators INNER JOIN Indicators on HistIndicators.IDKPI=Indicators.IDKPI) WHERE HistIndicators.Date = '{selectedDate}' AND HistIndicators.Critical =1").fetchall()
    #print(tourInfo)
    tourSheet = []
    for info in tourInfo:
        row = {'KPIName': info[0],
               'criteria': info[1],
               'STDdir': info[2],
               'RRdir': info[3],
               'IDUAP': info[4],
               'Comment': info[5],
               'IDKPI': info[6]}
        tourSheet.append(row)
    #print(len(tourSheet))
    return {'infoUAP': infoUAPG, 'tourSheet': tourSheet, 'dateDiff': dateDiff}


@app.route("/updateTourSheet", methods=['POST'])
def updateTourSheet():
    data = request.get_json()
    connF2F, curF2F = connectDB()

    IDKPI = data['IDKPI']
    RR = data['RR']
    STD = data['STD']
    comment = data['comment']
    selectedDate = data['selectedDate']
    if comment != "No Comment":
        IDUAP = curF2F.execute(
            f"SELECT IDUAP FROM Indicators INNER JOIN ProUAP on Indicators.IDP = ProUAP.IDP WHERE IDKPI = '{IDKPI}'").fetchone()[0]
        # IDUAP = [item[0] for item in IDUAP]
        print(IDKPI, IDUAP)

        curF2F.execute(
            f"UPDATE HistIndicators SET Comment = '{comment}' WHERE IDUAP = '{IDUAP}' AND Date = '{selectedDate}'")

    curF2F.execute(
        f"UPDATE HistIndicators SET STD_Dir = '{STD}', RR_Dir = '{RR}' WHERE IDKPI = '{IDKPI}' AND Date = '{selectedDate}'")
    connF2F.commit()
    return {'messsage': 'updated Succefully'}


if __name__ == '__main__':
    app.run(debug=True, port=5000)
