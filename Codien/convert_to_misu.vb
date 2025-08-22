Public mstrFileName As String
Private mchkOpen As Boolean
Private CKiriotoshiLine As Long
Private cstrThick As String
Private mchkEHSet As Boolean
Private mChkHeikou As Boolean
Private mchkOukiri As Boolean
Private mchkTepa As Boolean
Private mblnChk6th As Boolean

Sub cmdTest_Click()
 
 Dim ws As Worksheet
 Dim WS2 As Worksheet
 
 Set ws = ThisWorkbook.Worksheets(1)
 Set WS2 = ThisWorkbook.Worksheets(3)
  
 Call sImportFile
 
 If mchkOpen = False Then
  Exit Sub
 End If
 
 cstrThick = InputBox("Please input Plate Thickness(Number Only)")
 
 If cstrThick = "" Or cstrThick = vbNullString Then
  MsgBox "Canceled"
  Exit Sub
 End If
 ' Call sSetPunchEHValue
  
 
 mblnChk6th = False
 Call sReplacePunchCode
 
 ' Call sSetKakoJoukenSubProgram
 
 Call sKakoJoukenFinal(0)
 
 If mchkEHSet = False Then
 MsgBox "Canceled"
  ws.Columns(1).Clear
  WS2.Columns(1).Clear
   Exit Sub
 End If
 
 Call sExportFile
  
End Sub

Sub cmdUE_Click()
 
 Dim ws As Worksheet
 Dim WS2 As Worksheet
 
 Set ws = ThisWorkbook.Worksheets(1)
 Set WS2 = ThisWorkbook.Worksheets(3)
 
 Call sImportFile
 
 cstrThick = InputBox("Please input Plate Thickness")
 
 If IsNumeric(cstrThick) = False Then
  MsgBox "Please input number only"
  Exit Sub
 End If
 
 
 
 If mchkOpen = False Then
  Exit Sub
 End If
 
' Call sSetDaiEHValue
 mblnChk6th = False
 Call sReplaceUECode
 
 If mchkEHSet = False Then
  ws.Columns(1).Clear
  WS2.Columns(1).Clear
   Exit Sub
 End If
 
 Call sKakoJoukenFinal(1)
 
 Call sExportFile
End Sub

Private Sub sImportFile()

Dim FSO As New FileSystemObject
Dim xlapp As Application
Dim vntFileName As Variant
Dim TS As TextStream
Dim lngCount As Long
Dim strRec As String
Dim ws As Worksheet

Const cnsTitle = "Load Text File"
Const cnsFILTER = "‘S‚Ä‚Ìƒtƒ@ƒCƒ‹ (*.*),*.*"
 
 Set xlapp = Application
 Set ws = ThisWorkbook.Worksheets(3)
 mchkOpen = True
 
' xlapp.StatusBar = "Please select Load File"
 vntFileName = xlapp.GetOpenFilename(FileFilter:=cnsFILTER, Title:=cnsTitle)
 
 If VarType(vntFileName) = vbBoolean Then
  mchkOpen = False
  MsgBox "Canceled"
  Exit Sub
 End If
 
mstrFileName = vntFileName

Set TS = FSO.OpenTextFile(mstrFileName, ForReading)

lngCount = 1

Do Until TS.AtEndOfStream
  
  strRec = TS.ReadLine
  lngCount = lngCount + 1
  ws.Cells(lngCount, 1).Value = strRec
Loop

TS.Close

Set TS = Nothing
Set FSO = Nothing


End Sub


Private Sub sExportFile()

 Dim ws As Worksheet
 Dim OutputFile As String
 Dim lngCount As Long
 Dim Count As Integer
 Dim ImWs As Worksheet
 
 Set ws = ThisWorkbook.Worksheets(1)
 Set ImWs = ThisWorkbook.Worksheets(3)
 
 OutputFile = ActiveWorkbook.Path & "\" & fSetOutputFileName
' OutputFile = ActiveWorkbook.Path & "\TestOutput.txt"
 
  Open OutputFile For Output As #1
  lngCount = 1
  Count = 0
  Do While Count <> 2
    If InStr(ws.Cells(lngCount, 1).Value, vbLf) <> 0 Then
     ws.Cells(lngCount, 1).Value = Replace(ws.Cells(lngCount, 1).Value, vbLf, vbCrLf)
    End If
    
    If InStr(ws.Cells(lngCount, 1), """") <> 0 Then
     ws.Cells(lngCount, 1) = Replace(ws.Cells(i, 1), """", "")
    End If
  If ws.Cells(lngCount, 1) & "" <> "" Then
   Print #1, ws.Cells(lngCount, 1).Value
  End If
   
   If ws.Cells(lngCount, 1).Value = "%" Then
    Count = Count + 1
   End If
   lngCount = lngCount + 1
   
   If lngCount > 20000 Then
    Exit Do
   End If
   
  Loop
  
  Close #1
  
  ws.Columns(1).Clear
  ImWs.Columns(1).Clear
  
  MsgBox "Finished"
  
End Sub

Private Sub sReplacePunchCode()

 Dim Count As Integer
 Dim ws As Worksheet
 Dim i As Long
 Dim M02chk As Boolean
 Dim j As Long
 Dim KiriCount As Long
 Dim WS2 As Worksheet
 Dim chkChange As Boolean
 Dim intchkSetEH As Integer
 Dim chkSubEH As Boolean
 Dim Chk1st As Boolean
 Dim intChkHeikou As Integer
 
 
  Count = 0
  i = 1
  j = 1
  M02chk = False
  chkChange = False
  intchkSetEH = 0
  chkSubEH = False
  Chk1st = False
  intChkHeikou = 0
  mchkG04 = True
  G04Count = 0
  
  
 Set ws = ThisWorkbook.Worksheets(3)
 Set WS2 = ThisWorkbook.Worksheets(1)
 
 On Error GoTo trap
  Do While Count <> 2
  
  
  
  If ws.Cells(i, 1).Value = "M02" Then
   M02chk = True ' Main Program Syuryo Kakunin
  End If
    
  
  If InStr(ws.Cells(i, 1).Value, "O") = 1 Then
   
   If InStr(ws.Cells(i, 1).Value, "6th") <> 0 Then
    mblnChk6th = True
   End If
   
  ' ws.Cells(i, 1).Value = fChangeProgramNo(ws.Cells(i, 1).Value)
   If i - 1 > 0 Then
    If ws.Cells(i - 1, 1) = "%" Then
     WS2.Cells(j, 1) = Replace(ws.Cells(i, 1), "O", "L")
    Else
     WS2.Cells(j, 1) = fChangeProgramNo(ws.Cells(i, 1), M02chk)
    End If
   End If
   If intchkSetEH = 0 Then
  '   Call sSetPunchEHValue(j + 2)
     Call sSetDaiEHValue(j + 2, 0, mblnChk6th)
     intchkSetEH = 1
     j = j + 23
 '    Call sSetZValue(ws, WS2, j)
 '    j = j + 5
     Call sSetHeikou(j)
    'If fSetPunchProgramStart(ws, i) <> i Then
     i = fSetPunchProgramStart(ws, i)
   ' End If
     j = j + 3
   '  i = i + 1
'   Exit Sub
   End If
   
   chkChange = True
   
   If mChkHeikou = False And intChkHeikou = 0 Then
    chkChange = False
    intChkHeikou = 1
   End If
   
  End If
  
  If InStr(ws.Cells(i, 1), "1ST") <> 0 And InStr(ws.Cells(i, 1), "(") <> 0 Then
   Chk1st = True
  End If
  
  If ws.Cells(i, 1).Value = "M60" And ws.Cells(i + 1, 1).Value = "M80" Then
    'ws.Cells(i, 1).Value = "M20" & vbLf & "M78"
    WS2.Cells(j, 1).Value = "M20" & vbLf & "M78"
   ' Cell Nai Kaigyo wo Nakusu baai
   ' WS2.Cells(j, 1).Value = "M20"
   ' WS2.Cells(j + 1, 1).Value = "M78"
   ' Range(Cells(i, 1), Cells(i + 1, 2)).Insert
   ' ws.Cells(i + 1, 1).Value = "M80M82M84"
    WS2.Cells(j + 1, 1).Value = "M80M82M84"
    chkChange = True
    i = i + 2
    j = j + 2
    ' Cell Nai Kaigyo wo Nakusu baai
  '  j = j + 3
  End If
  
  If ws.Cells(i, 1).Value = "M80" Then
   'ws.Cells(i, 1).Value = "M84"
   WS2.Cells(j, 1).Value = "M84"
   chkChange = True
  End If
  
  If ws.Cells(i, 1).Value = "G92" Then
  ' ws.Cells(i, 1) = ""
   WS2.Cells(j, 1) = ""
   chkChange = True
  End If
  
 
  
  If ws.Cells(i, 1).Value = "G95" Then
  ' ws.Cells(i, 1).Value = "M90"
   WS2.Cells(j, 1).Value = "M90"
   chkChange = True
  End If
  
  If ws.Cells(i, 1).Value = "M27" Or ws.Cells(i, 1).Value = "M28" Or ws.Cells(i, 1).Value = "M29 " Then
   If InStr(ws.Cells(i + 1, 1).Value, "S") <> 0 And InStr(ws.Cells(i + 1, 1).Value, "D") <> 0 Then
  '  ws.Cells(i, 1).Value = fSetFH(ws.Cells(i + 1, 1).Value)
  '  WS2.Cells(j, 1).Value = fSetFH(ws.Cells(i + 1, 1).Value)
    chkChange = True
   Else
    'ws.Cells(i, 1).Value = ""
     WS2.Cells(i, 1).Value = ""
     chkChange = True
   End If
  End If
  
   If Left(ws.Cells(i, 1), 1) = "S" And Len(ws.Cells(i, 1)) = 3 Then
    Call sSetDaiEH(i, j, ws.Cells(i, 1))
 '   If ws.Cells(i + 1, 1) & "" = "" Then
    ' i = i + 2
 '   End If
    j = j + 1
    chkChange = True
   End If
   
  If ws.Cells(i, 1).Value = "M50" Then
 ' ws.Cells(i, 1).Value = "M21M91"
   WS2.Cells(j, 1).Value = "M21M91"
   chkChange = True
  End If
  
  If InStr(ws.Cells(i, 1), "T") <> 0 And InStr(ws.Cells(i, 1), "(") = 0 Then
 '   ws.Cells(i, 1).Value = Left(ws.Cells(i, 1).Value, InStr(ws.Cells(i, 1), "T") - 1)
    WS2.Cells(j, 1).Value = Left(ws.Cells(i, 1).Value, InStr(ws.Cells(i, 1), "T") - 1)
    chkChange = True
  End If
   
  If InStr(ws.Cells(i, 1), "G") <> 0 And InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
   If InStr(ws.Cells(i + 1, 1), "M98") <> 0 Then
 '  ws.Cells(i, 1).Value = Left(ws.Cells(i, 1).Value, InStr(ws.Cells(i, 1).Value, "S") - 1) & fReplaceKakoJouken(ws.Cells(i + 1, 1), ws)
    'WS2.Cells(j, 1).Value = Left(ws.Cells(i, 1).Value, InStr(ws.Cells(i, 1).Value, "S") - 1) & fReplaceKakoJouken(ws.Cells(i + 1, 1), ws)
    If fChkSubEHset(ws.Cells(i + 1, 1)) = True Then
     If InStr(ws.Cells(i - 1, 1), "G94") <> 0 Then
       WS2.Cells(j, 1) = ""
     Else
      WS2.Cells(j, 1).Value = fSetFH(ws.Cells(i, 1).Value)
     End If
    
  '   WS2.Cells(j, 1).Value = "FH"
     WS2.Cells(j + 1, 1).Value = fReplaceKakoJouken(ws.Cells(i + 1, 1), ws)
     WS2.Cells(j + 2, 1).Value = Left(ws.Cells(i, 1).Value, InStr(ws.Cells(i, 1).Value, "S") - 1)
     j = j + 2
    Else
      Call sSetDaiEH(i, j, ws.Cells(i, 1))
    End If
   Else
     Call sSetDaiEH(i, j, ws.Cells(i, 1))
   End If
     If InStr(WS2.Cells(j + 1, 1), "G52") <> 0 Then
      If InStr(WS2.Cells(j + 1, 1), "G01") = 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G52", "G01")
      ElseIf InStr(WS2.Cells(j + 1, 1), "G01") <> 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G52", "")
      End If
     End If
     
     If InStr(WS2.Cells(j + 1, 1), "G51") <> 0 Then
      If InStr(WS2.Cells(j + 1, 1), "G01") = 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G51", "G01")
      ElseIf InStr(WS2.Cells(j + 1, 1), "G01") <> 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G51", "")
      End If
     End If
     j = j + 2
    chkChange = True
   End If
  
   If InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
    If InStr(ws.Cells(i - 1, 1), "S") <> 0 And InStr(ws.Cells(i - 1, 1), "D") <> 0 Then
     chkChange = True
    End If
   End If
   
  
  If M02chk = True And InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
   'ws.Cells(i, 1).Value = ""
    WS2.Cells(j, 1).Value = ""
    chkChange = True
   ' Rows(i).Delete
  End If
  
  If ws.Cells(i, 1).Value = "M99" Then
 ' ws.Cells(i, 1).Value = "G23"
   WS2.Cells(j, 1).Value = "G23"
   chkChange = True
  End If
  
  If ws.Cells(i, 1).Value = "M40" Then
  WS2.Cells(j, 1) = "M91" & vbLf & "M85"
 ' Cell Nai Kaigyo wo Nakusu baai
 '  WS2.Cells(j, 1) = "M91"
 '  WS2.Cells(j + 1, 1) = "M85"
 '  j = j + 1
   chkChange = True
  End If
  
  If InStr(ws.Cells(i, 1).Value, "G94") <> 0 Then
  'ws.Cells(i, 1).Value = "F200000"
   WS2.Cells(j, 1).Value = "F200000"
   chkChange = True
  End If
  
  If InStr(ws.Cells(i, 1), "G32") <> 0 Then
   chkChange = True
  End If
  
  If InStr(ws.Cells(i, 1).Value, "M98") <> 0 Then
 '  ws.Cells(i, 1).Value = fReplaceSubProgramYobi(ws.Cells(i, 1).Value)
    WS2.Cells(j, 1).Value = fReplaceSubProgramYobi(ws.Cells(i, 1).Value)
    If Chk1st = True Then
     WS2.Cells(j + 1, 1) = "G04X1.0"
     Chk1st = False
     j = j + 1
    End If
    chkChange = True
  End If
  
  If M02chk = True And InStr(ws.Cells(i, 1), "G04") <> 0 Then
   Call sReplaceKiriotoshi(ws, i, WS2, j)
   j = CKiriotoshiLine
   i = fsetI(ws, i)
   chkChange = True
  End If
  
  
  If M02chk = True And InStr(ws.Cells(i, 1), "(") <> 0 Then
 ' ws.Cells(i, 1) = ""
   WS2.Cells(j, 1) = ""
   chkChange = True
'   Rows(i).Delete
  End If
  
  If InStr(ws.Cells(i, 1), "%") <> 0 And M02chk = True Then
   Call sProgramFinish(j)
   Exit Do
  End If
   
  If chkChange = False Then
   WS2.Cells(j, 1) = ws.Cells(i, 1)
  End If
  
  
  i = i + 1
  j = j + 1
  
  If ws.Cells(i, 1).Value = "%" Then
   Count = Count + 1
  End If
  
  
  
  If Count = 2 Then
   WS2.Cells(j, 1) = ws.Cells(i, 1)
  End If
  chkChange = False
  
  If i >= 20000 Then
   Exit Do
  End If
   
  
  
Loop

Exit Sub
' WS2.Range("A1").EntireColumn.AutoFit
trap:

 Call ErrSyori("sReplacePunchCode", Err.Description)
 
End Sub

Private Function fReplaceSubProgramYobi(ByVal strLine As String)
 
Dim strSet As String

  strSet = Replace(strLine, "M98", "G22")
  ' Change replace L to H
' strSet = Replace(strSet, "P", "L")
  strSet = Replace(strSet, "P", "H")
fReplaceSubProgramYobi = strSet

 
End Function

Private Function fReplaceKakoJouken(ByVal strLine As String, ByVal ws As Worksheet)

 Dim strKako As String
 Dim SetKako As String
 Dim SetOffset As String
 
 On Error GoTo trap
 strKako = fGetKakoJouken(ws, strLine)
 
 ' Change setOffset 000 to 300
 If InStr(strKako, "S") < InStr(strKako, "D") Then
  SetKako = "2" & Mid(strKako, InStr(strKako, "S") + 1, InStr(strKako, "D") - (InStr(strKako, "S") + 1))
 ' SetOffset = Format(Mid(strKako, InStr(strKako, "D") + 1, 2), "000")
  SetOffset = "3" & Mid(strKako, InStr(strKako, "D") + 1, 2)
 ElseIf InStr(strKako, "S") > InStr(strKako, "D") Then
  'SetOffset = Format(Mid(strKako, InStr(strKako, "D") + 1, InStr(strKako, "S") - (InStr(strKako, "D") + 1)), "000")
  SetOffset = "3" & Mid(strKako, InStr(strKako, "D") + 1, 2)
  SetKako = "2" & Mid(strKako, InStr(strKako, "S") + 1, 2)
 End If
 
 fReplaceKakoJouken = "EH" & SetKako & "H" & SetOffset
  
 Exit Function
 
trap:
 
 Call ErrSyori("fReplaceKakoJouken", Err.Description)
 
End Function

Private Function fGetKakoJouken(ByVal ws As Worksheet, ByVal chkLine As String)
 
 
Dim i As Long
Dim strchkLine As String
Dim Count As Long
Dim chkM02 As Boolean

On Error GoTo trap
If InStr(chkLine, "M98") <> 0 Then
 ' strchkLine = Format(Mid(chkLine, InStr(chkLine, "P") + 1, Len(chkLine)), "0000")
  strchkLine = Format(Mid(chkLine, InStr(chkLine, "P") + 1, 4), "0000")
End If
 
  chkM02 = False
  Count = 0
  i = 1
 Do While Count <> 2
  
  If ws.Cells(i, 1) = "M02" Then
   chkM02 = True
  End If
 ' Kono jouken wo mitasezu null ga kaeru
 If chkM02 = True And InStr(ws.Cells(i, 1), strchkLine) <> 0 And Left(ws.Cells(i, 1), 1) = "O" Then
  'And InStr(ws.Cells(i, 1), "G") = 0 Then
   fGetKakoJouken = ws.Cells(i + 1, 1)
   Exit Do
 End If
 
 i = i + 1
 
 If ws.Cells(i, 1) = "%" Then
  Count = Count + 1
 End If
 
 If i >= 20000 Then
  Exit Function
 End If
 
Loop

Exit Function

trap:

 Call ErrSyori("fGetKakoJouken", Err.Description)
 
End Function

Private Function fChangeProgramNo(ByVal strLine As String, ByVal M02chk As Boolean)

 Dim lngProgramNo As Long
' Dim ws As Worksheet
' Dim chkArray()
' Dim i As Integer
 
 Set ws = ThisWorkbook.Worksheets(3)
 
 On Error GoTo trap
 If M02chk = True And IsNumeric(Replace(strLine, "O", "")) = True Then
  lngProgramNo = CLng(Replace(strLine, "O", ""))
 ElseIf M02chk = True And IsNumeric(Replace(strLine, "O", "")) = False Then
  fChangeProgramNo = ""
  Exit Function
 End If

' Change output L to H
' fChangeProgramNo = "L" & lngProgramNo
 If M02chk = True Then
  fChangeProgramNo = "N" & lngProgramNo
 Else
  fChangeProgramNo = "H" & Right(strLine, Len(strLine) - 1)
 End If
 
 Exit Function
 
trap:
 
 Call ErrSyori("fChangeProgramNo", Err.Description)
 
End Function

Private Function fSetFH(ByVal strLine As String)

 Dim strSetLine As String
 Dim lngsetNo As Long
 
 On Error GoTo trap
  strSetLine = Mid(strLine, InStr(strLine, "S") + 1, 2)
  
  lngsetNo = 100 + CLng(strSetLine)
  
  
  
  fSetFH = "FH" & CStr(lngsetNo)
 Exit Function
 
trap:
 
 Call ErrSyori("fSetH", Err.Description)
 
  
End Function

Private Sub sReplaceKiriotoshi(ByVal ws As Worksheet, ByVal lngCount As Long, ByVal WS2 As Worksheet, ByVal OutputCount As Long)
 
 ' ws Yomikomi Sheet
 ' WS2 Kakikomi Sheet
 Dim ReplaceLines()
 Dim Count As Long
 Dim i As Long
 Dim chkCount As Long
 Dim sCount As Long
 Dim j As Long
 Dim k As Long
 Dim lngPut As Long
 
 Count = lngCount
 lngPut = OutputCount
 i = 0
  
  On Error GoTo trap
  Do While 1 = 1
   
   If ws.Cells(Count, 1) = "M80" Then
    Count = Count - 1
    lngPut = lngPut - 1
    Exit Do
   End If
   
   Count = Count - 1
   lngPut = lngPut - 1
   ' Mugen Loop Boushi
   If Count = 0 Or lngCount - Count = 500 Then
    Exit Sub
   End If
   
  Loop
   
  sCount = Count
  lngPut = lngPut - 1
  Do While 1 = 1
   ReDim Preserve ReplaceLines(i)
   
   ReplaceLines(i) = ws.Cells(sCount, 1)
 '  Debug.Print ReplaceLines(i)
   i = i + 1
   If ws.Cells(sCount, 1) = "M99" Then
    Exit Do
   End If
   sCount = sCount + 1
   
   
  Loop
  
  
  i = lngPut
  k = 1
  
 
  
  For j = 0 To UBound(ReplaceLines)
   If InStr(ReplaceLines(j), "G04") <> 0 Then
   ' ws.Cells(i, 1) = ReplaceLines(j)
    WS2.Cells(i, 1) = ReplaceLines(j)
    Exit For
   End If
  Next j
  
  
  i = i + 1
  
  For j = 0 To UBound(ReplaceLines)
   If InStr(ReplaceLines(j), "S") <> 0 And InStr(ReplaceLines(j), "D") <> 0 Then
   ' ws.Cells(i, 1) = fSetFH(ReplaceLines(j))
    WS2.Cells(i, 1) = fSetFH(ReplaceLines(j))
    Exit For
   End If
  Next j
  
  i = i + 1

  For j = 0 To UBound(ReplaceLines)
   If ReplaceLines(j) = "M80" Then
  ' ws.Cells(i, 1) = ReplaceLines(j)
    WS2.Cells(i, 1) = "M84"
    Exit For
   End If
  Next j
  
  i = i + 1
  
  For j = 0 To UBound(ReplaceLines)
  ' Debug.Print ReplaceLines(j)
  ' If ReplaceLines(j) = "M90" Then
   If ReplaceLines(j) = "G95" Then
 '  WS2.Cells(i, 1) = ReplaceLines(j)
    WS2.Cells(i, 1) = "M90"
    Exit For
   End If
  Next j
  
  i = i + 1
  
  For j = 0 To UBound(ReplaceLines)
   If InStr(ReplaceLines(j), "S") <> 0 And InStr(ReplaceLines(j), "D") <> 0 Then
  ' ws.Cells(i, 1) = "G91" & ReplaceLines(0) & fSetKako2(ReplaceLines(j))
    WS2.Cells(i, 1) = "G91" & ReplaceLines(0) & fSetKako2(ReplaceLines(j))
    Exit For
   End If
  Next j
  
  i = i + 1
  
  
 ' For j = 0 To UBound(ReplaceLines)
 '  If InStr(ReplaceLines(j), "G04") <> 0 Then
 '   ws.Cells(i, 1) = ReplaceLines(j)
 '   Exit For
 '  End If
 ' Next j
  
'  i = i + 1
  
  For j = 0 To UBound(ReplaceLines)
   If InStr(ReplaceLines(j), "G91") <> 0 Then
  ' ws.Cells(i, 1) = Replace(ReplaceLines(j), "G91", "")
  
    WS2.Cells(i, 1) = Replace(ReplaceLines(j), "G91", "")
    Do While 1 = 1
     If InStr(ReplaceLines(j + k), "G01") = 0 Then
      Exit Do
     End If
  '  ws.Cells(i + k, 1) = ReplaceLines(j + k)
     WS2.Cells(i + k, 1) = ReplaceLines(j + k)
     k = k + 1
     
     If k = 100 Then
      Exit Do
     End If
     
    Loop
   
    Exit For
  End If
  
  Next j
  
  
  i = i + k
  
 ' For j = 0 To UBound(ReplaceLines)
 '  If InStr(ReplaceLines(j), "G94") <> 0 Then
 '  ws.Cells(i, 1) = "M91" & vbLf & "M85" & vbLf & "F200000"
    WS2.Cells(i, 1) = "M91"
    WS2.Cells(i + 1, 1) = "M85"
    WS2.Cells(i + 2, 1) = "F200000"
    i = i + 3
    
    
 '   Exit For
 '  End If
 ' Next j
  k = 1
  For j = 0 To UBound(ReplaceLines)
   If InStr(ReplaceLines(j), "G94") <> 0 Then
 '  And InStr(ReplaceLines(j + 1), "G01") Then
    Do While 1 = 1
     If InStr(ReplaceLines(j + k), "G01") = 0 Then
      Exit Do
     End If
  '  ws.Cells(i + k, 1) = ReplaceLines(j + k)
    If InStr(ReplaceLines(j + k), "T") Then
     WS2.Cells(i + k - 1, 1) = Left(ReplaceLines(j + k), InStr(ReplaceLines(j + k), "T") - 1)
    Else
      WS2.Cells(i + k - 1, 1) = ReplaceLines(j + k)
    End If
    
     k = k + 1
    If k = 100 Then
     Exit Do
    End If
    Loop
     Exit For
   End If
  Next j
  
   i = i + k - 1
 
   
   WS2.Cells(i, 1) = "G23"
   CKiriotoshiLine = i + 1
   
   
'  i = i + 1
  
'  Do While 1 = 1
'   If InStr(ws.Cells(i, 1), "F") <> 0 Then
  ' ws.Cells(i, 1) = ""
'    WS2.Cells(i, 1) = ""
  '  Rows(i).Delete
'    WS2.Rows(i).Delete
'    Exit Do
'   End If
   
  ' ws.Cells(i, 1) = ""
'   WS2.Cells(i, 1) = ""
  ' Rows(i).Delete
'   WS2.Rows(i).Delete
  'i = i + 1
'  Loop
  
  
'  For i = Count To sCount
   
'   If InStr(ws.Cells(i, 1), "G04") <> 0 And InStr(ws.Cells(i + 1, 1), "M") <> 0 Then
   ' ws.Cells(i, 1) = ""
'    WS2.Cells(i, 1) = ""
 '   Rows(i).Delete
'    WS2.Rows(i).Delete
'   End If
   
'   If ws.Cells(i, 1) = "M52" Then
   ' ws.Cells(i, 1) = ""
'    WS2.Cells(i, 1) = ""
   ' Rows(i).Delete
'    WS2.Rows(i).Delete
'   End If
   
'  Next i
  
  
' For i = 0 To UBound(ReplaceLines)
'  Debug.Print ReplaceLines(i)
' Next i
 Exit Sub
 
trap:
  
  Call ErrSyori("sReplaceKiriotoshi", Err.Description)
 
End Sub

Private Function fSetKako2(ByVal strLine As String)
 
 Dim setEH As String
 Dim SetH As String
 
 On Error GoTo trap
  setEH = "2" & Mid(strLine, InStr(strLine, "S") + 1, 2)
  SetH = "3" & Format(Mid(strLine, InStr(strLine, "D") + 1, 2), "00")
 
  fSetKako2 = "EH" & setEH & "H" & "301"
  
  Exit Function
  
trap:
  
  Call ErrSyori("fSetKako2", Err.Description)
  
End Function

Private Sub sChangeKiriotoshi2(ByVal ws As Worksheet, ByVal lngCount As Long, ByVal WS2 As Worksheet)
 
  ' ws Yomikomi Sheet
 ' WS2 Kakikomi Sheet
 Dim ReplaceLines()
 Dim Count As Long
 Dim i As Long
 Dim chkCount As Long
 Dim sCount As Long
 Dim j As Long
 Dim k As Long
 
 Count = lngCount
 i = 0
 On Error GoTo trap
  Do While 1 = 1
   
   If ws.Cells(Count, 1) = "M84" Then
    Count = Count - 1
    Exit Do
   End If
   
   Count = Count - 1
   
   ' Mugen Loop Boushi
   If Count = 0 Or lngCount - Count = 100 Then
    Exit Sub
   End If
   
  Loop
   
  sCount = Count
  
  Do While 1 = 1
   ReDim Preserve ReplaceLines(i)
   
   ReplaceLines(i) = ws.Cells(sCount, 1)
   i = i + 1
   If ws.Cells(sCount, 1) = "M99" Then
    Exit Do
   End If
   sCount = sCount + 1
   
  Loop
  
  i = Count
  k = 1
  
  For j = 0 To UBound(ReplaceLines)
   
   If InStr(ReplaceLines(j), "G04") <> 0 Then
    WS2.Cells(i, 1) = ReplaceLines(j)
   End If
   
   If InStr(ReplaceLines(j), "S") <> 0 And InStr(ReplaceLines(j), "D") <> 0 Then
    WS2.Cells(i, 1) = fSetFH(ReplaceLines(j))
   End If
   
   If ReplaceLines(j) = "M84" Then
    WS2.Cells(i, 1) = ReplaceLines(j)
   End If
   
   
   i = i + 1
 Next j
 
 Exit Sub
 
trap:
 
 Call ErrSyori("sChangeKiriotoshi2", Err.Description)
 
End Sub

Private Function fsetI(ByVal ws As Worksheet, ByVal lngCount As Long)

 Dim Count As Long
 
 Count = lngCount
 On Error GoTo trap
   Do While 1 = 1
     
    If ws.Cells(Count, 1) = "M99" Then
    '  Count = Count + 1
      Exit Do
    End If
    Count = Count + 1
    
   Loop
   
  fsetI = Count
  
 Exit Function
 
trap:
 
 Call ErrSyori("fsetI", Err.Description)
 
End Function

Private Function fSetOutputFileName()

 Dim strFileName As String
 Dim i As Long
 
  
   
   i = 1
   On Error GoTo trap
  Do While i < 1000
   
   If InStr(Right(mstrFileName, i), "\") <> 0 Then
    Exit Do
   End If
   i = i + 1
   
   If i = Len(mstrFileName) Then
    Exit Do
   End If
   
  Loop
'  Debug.Print Right(mstrFileName, i - 1)
    
  strFileName = Right(mstrFileName, i - 1)
  strFileName = Left(strFileName, InStr(strFileName, ".") - 1) & "(Conversion F to M)" & Right(strFileName, Len(strFileName) - InStr(strFileName, ".") + 1)
   
  
  
 ' Debug.Print strFileName
  
  fSetOutputFileName = strFileName
   
  Exit Function

trap:
 
 Call ErrSyori("fSetOutputFileName", Err.Description)
 
 
End Function

Private Sub sReplaceUECode()

 Dim Count As Integer
 Dim ws As Worksheet
 Dim i As Long
 Dim M02chk As Boolean
 Dim j As Long
 Dim KiriCount As Long
 Dim WS2 As Worksheet
 Dim chkChange As Boolean
 Dim chkStartP As Boolean
 Dim chkG23 As Boolean
 Set ws = ThisWorkbook.Worksheets(3)
 Set WS2 = ThisWorkbook.Worksheets(1)
 Dim chk As Boolean
 Dim blankcount As Integer
 Dim blankstart As Long
 
  Count = 0
  i = 1
  j = 1
  M02chk = False
  chkChange = False
  intchkSetEH = 0
  chkStartP = False
  mchkTepa = False
  blankcount = 0
 ' On Error GoTo trap
  Do While Count <> 2
    

   
   If ws.Cells(i, 1) = "%" Then
    Count = Count + 1
   End If
   
   If ws.Cells(i, 1) = "M02" Then
    M02chk = True
   End If
   
   
   If InStr(ws.Cells(i, 1), "T") <> 0 And InStr(ws.Cells(i, 1), "(") = 0 Then
    If Right(ws.Cells(i, 1), Len(ws.Cells(i, 1)) - InStr(ws.Cells(i, 1), "T") + 1) = "T0." Then
     WS2.Cells(j, 1) = Left(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "T") - 1)
    Else
     WS2.Cells(j, 1) = Replace(ws.Cells(i, 1), "T", "A")
    End If
    chkChange = True
   End If
   
   If InStr(ws.Cells(i, 1), "O") <> 0 And Left(ws.Cells(i, 1), 1) <> "(" Then
    If i - 1 > 0 Then
     If Trim(ws.Cells(i - 1, 1)) = "%" Then
      WS2.Cells(j, 1) = Replace(ws.Cells(i, 1), "O", "L")
     Else
      WS2.Cells(j, 1) = fChangeProgramNo(ws.Cells(i, 1), M02chk)
     End If
    End If
    
    If intchkSetEH = 0 Then
     Call sSetDaiEHValue(j + 2, 1, False)
    
     intchkSetEH = 1
     j = j + 23
     Call sSetZValue(ws, WS2, j)
        j = j + 5
      Call sSetHeikou(j)
       j = j + 4
       i = fSetProgramStart(j)
       j = j + 1
      chkChange = True
     If mchkTepa = True Then
      chkStartP = True
      chkChange = False
     End If
  '    Exit Sub
    End If
    
    
   End If
   
   If ws.Cells(i, 1) = "M99" Then
    chkG23 = True
   End If
   
   If InStr(ws.Cells(i, 1), "G32") <> 0 Then
    chkChange = True
   End If
   
   If M02chk = True And InStr(ws.Cells(i, 1), "O") <> 0 Then
    chkG23 = False
   End If
   
   If chkG23 = True Then
    chkChange = True
   End If
   
   If chkG23 = True And ws.Cells(i, 1) = "%" Then
    WS2.Cells(j, 1) = "%"
    Exit Do
   End If
   
   If InStr(ws.Cells(i, 1), "G90G00") <> 0 And chkStartP = False Then
    If fChkG92(j) = False Then
     WS2.Cells(j, 1) = Replace(ws.Cells(i, 1), "G00", "G92")
    Else
     WS2.Cells(j, 1) = ws.Cells(i, 1)
    End If
     chkStartP = True
     chkChange = True
   End If
   
   If ws.Cells(i, 1) = "G92" Then
    WS2.Cells(j, 1) = ""
    If InStr(ws.Cells(i + 1, 1), "M00") <> 0 Then
     chkChange = False
    Else
     chkChange = True
    End If
   End If
   
   If ws.Cells(i, 1) = "M60" Then
    WS2.Cells(j, 1) = "M20" & vbLf & "M78"
    WS2.Cells(j + 1, 1) = "M80M82M84"
    WS2.Cells(j + 2, 1) = "M90"
    j = j + 2
    chkChange = True
   End If
   
   If ws.Cells(i, 1) = "M27" Or ws.Cells(i, 1) = "M28" Or ws.Cells(i, 1) = "M29" Then
    WS2.Cells(j, 1) = ""
    chkChange = True
   End If
   
   ' If ws.Cells(i, 1) = "S01"
   If Left(ws.Cells(i, 1), 1) = "S" And Len(ws.Cells(i, 1)) = 3 Then
    Call sSetDaiEH(i, j, ws.Cells(i, 1))
 '   If ws.Cells(i + 1, 1) & "" = "" Then
    ' i = i + 2
 '   End If
    j = j + 1
    chkChange = True
   End If
   
   If InStr(ws.Cells(i, 1), "G") <> 0 And InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 And InStr(ws.Cells(i, 1), "(") = 0 Then
    If InStr(ws.Cells(i + 1, 1), "M98") <> 0 Then
     
     If fChkSubEHset(ws.Cells(i + 1, 1)) = True Then
      
      WS2.Cells(j, 1) = fSetFH(ws.Cells(i, 1))
      WS2.Cells(j + 1, 1) = fReplaceKakoJouken(ws.Cells(i + 1, 1), ws)
      WS2.Cells(j + 2, 1) = Left(ws.Cells(i, 1).Value, InStr(ws.Cells(i, 1).Value, "S") - 1)
      j = j + 2
     Else
      Call sSetDaiEH(i, j, ws.Cells(i, 1))
     End If
    
    Else
     Call sSetDaiEH(i, j, ws.Cells(i, 1))
    End If
    
     If InStr(WS2.Cells(j + 1, 1), "G52") <> 0 Then
      If InStr(WS2.Cells(j + 1, 1), "G01") = 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G52", "G01")
      ElseIf InStr(WS2.Cells(j + 1, 1), "G01") <> 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G52", "")
      End If
     End If
     
     If InStr(WS2.Cells(j + 1, 1), "G51") <> 0 Then
      If InStr(WS2.Cells(j + 1, 1), "G01") = 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G51", "G01")
      ElseIf InStr(WS2.Cells(j + 1, 1), "G01") <> 0 Then
       WS2.Cells(j + 1, 1) = Replace(WS2.Cells(j + 1, 1), "G51", "")
      End If
     End If
 '   i = i + 2
    j = j + 2
    chkChange = True
  '  Exit Sub
   End If
   
   If InStr(ws.Cells(i, 1), "M98") <> 0 Then
    WS2.Cells(j, 1) = Replace(ws.Cells(i, 1), "M98", "G22")
    WS2.Cells(j, 1) = Replace(WS2.Cells(j, 1), "P", "H")
    chkChange = True
   End If
   
   If ws.Cells(i, 1) = "M50" Then
  '  If mchkTepa = False Then
      WS2.Cells(j, 1) = "M21M91"
  '  Else
   '   mchkTepa = False
  '  End If
     chkChange = True
   End If
   
   If InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
    If InStr(ws.Cells(i - 1, 1), "S") <> 0 And InStr(ws.Cells(i - 1, 1), "D") <> 0 Then
     chkChange = True
    End If
   End If
   
   If M02chk = True And InStr(ws.Cells(i, 1), "D") <> 0 Then
    WS2.Cells(j, 1) = Left(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "D") - 1)
    chkChange = True
    If InStr(ws.Cells(i, 1), "S") <> 0 Then
     chkChange = False
    End If
   End If
   
   If ws.Cells(i, 1) & "" = "" Then
    chkChange = True
   End If
   
   If ws.Cells(i, 1) = "M99" Then
     WS2.Cells(j, 1) = "G23"
     chkChange = True
   End If
   
   If ws.Cells(i, 1).Value = "M40" Then
   WS2.Cells(j, 1) = "M91" & vbLf & "M85"
   chkChange = True
  End If
  
   If M02chk = True And InStr(ws.Cells(i, 1), "O") <> 0 Then
    WS2.Cells(j, 1) = Replace(ws.Cells(i, 1), "O", "N")
    chkChange = True
   End If
   
   If InStr(ws.Cells(i, 1), "G52") <> 0 And chkChange = False Then
    WS2.Cells(j, 1) = Replace(ws.Cells(i, 1), "G52", "G01")
    chkChange = True
   End If
   
   If M02chk = True And (InStr(ws.Cells(i, 1), "S") <> 0 Or InStr(ws.Cells(i, 1), "D") <> 0) Then
    chkChange = True
   End If
   
   If InStr(ws.Cells(i, 1), "G95") <> 0 Then
    WS2.Cells(i, 1) = "M90"
    chkChange = True
   End If
   
   If M02chk = True And InStr(ws.Cells(i, 1), "G04") <> 0 Then
    Call sReplaceKiriotoshi(ws, i, WS2, j)
    j = CKiriotoshiLine
    i = fsetI(ws, i)
    chkChange = True
   End If
   
   If InStr(ws.Cells(i, 1), "#") <> 0 And M02chk = True Then
    Call sProgramFinish(j)
   Exit Do
   End If
   
   
   If chkChange = False Then
    WS2.Cells(j, 1) = ws.Cells(i, 1)
   End If
   
   If ws.Cells(i, 1) & "" = "" Then
    blankcount = blankcount + 1
    blankstart = j
   End If
   
  ' If i > 2 Then
  '  If blankcount > 0 And ws.Cells(i, 1) & "" = "" And ws.Cells(i - 1, 1) & "" <> "" Then
  '     blankcount = 0
  '  End If
  ' End If
   
  ' If blankcount = 10 Then
  '   WS2.Cells(blankstart, 1) = "%"
  '   Exit Do
  ' End If
    
   i = i + 1
   j = j + 1
   chkChange = False
   
   If i = 10000 Then
    Exit Do
   End If
   
  Loop
  
  i = 1
   Exit Sub

trap:
   
 Call ErrSyori("sReplaceUECode", Err.Description)
    
End Sub

Sub cmdClear_Click()
 
 Dim ws As Worksheet
 Dim i As String
 Dim j As Long
 
' i = "15.5"
' j = CLng(Left(i, InStr(i, ".") - 1))
 Set ws = ThisWorkbook.Worksheets(1)
' MsgBox CInt(j)
 
 ws.Columns(1).Clear
 
End Sub

Private Sub sSetDaiEHValue(ByVal lngSetLine As Long, ByVal chkwhere As Integer, ByVal blnCheck6th As Boolean)
 
 Dim ws As Worksheet
 Dim WS2 As Worksheet
 Dim strThickness As String
 Dim i As Long
 Dim EpackArray(4, 5)
 Dim j As Integer
 Dim k As Integer
 Dim CellX As Long
 Dim CellY As Long
 Dim chkThickline As Integer
 Dim intBlankCount As Integer
 Dim intCheckthick As Integer
 
 On Error GoTo trap
 
 intCheckthick = fSetThickness
 
 strThickness = CStr(intCheckthick) & "mm"
 
' If InStr(cstrThick, "m") = 0 Then
'   strThickness = cstrThick & "mm"
' Else
'  strThickness = cstrThick
' End If
 'chkwhere = 0 :from punch chkwhere = 1 from dai
 
 If chkwhere = 1 Then
  CellY = 5
  CellX = 10
  chkThickline = 15
 ElseIf chkwhere = 0 Then
  If blnCheck6th = True And intCheckthick <= 50 Then
   Call sSetPunch6th(lngSetLine)
   mchkEHSet = True
   Exit Sub
  Else
   CellY = 5
   CellX = 2
   chkThickline = 7
  End If
 End If
 
 Set ws = ThisWorkbook.Worksheets(1)
 Set WS2 = ThisWorkbook.Worksheets(2)
 
 i = 1
 intBlankCount = 0
 Do While i < 20000
  
  If WS2.Cells(i, chkThickline) = strThickness Then
   CellY = i + 3
   If chkwhere = 1 Then
    CellX = 10
   ElseIf chkwhere = 0 Then
    CellX = 2
   End If
   
   For j = 0 To 4
    For k = 0 To 5
    
    If WS2.Cells(CellY, CellX) & "" <> "" Then
     EpackArray(j, k) = CStr(WS2.Cells(CellY, CellX))
    Else
     EpackArray(j, k) = ""
    End If
    
    CellX = CellX + 1
    Next k
    If chkwhere = 1 Then
     CellX = 10
    ElseIf chkwhere = 0 Then
     CellX = 2
    End If
    CellY = CellY + 1
   Next j
   mchkEHSet = True
  Exit Do
  End If
  
  If WS2.Cells(i, chkThickline) & "" = "" Then
   intBlankCount = intBlankCount + 1
  ElseIf WS2.Cells(i, chkThickline) & "" <> "" Then
   intBlankCount = 0
  End If
  
  i = i + 1
  
  If intBlankCount >= 10 Then
   mchkEHSet = False
   Exit Do
  End If
  
  If i >= 20000 Then
   mchkEHSet = False
   Exit Do
  End If
  
 Loop
 ' If EpackArray(0, 1) & "" = "" Then
  If mchkEHSet = False Then
   MsgBox "Matching data don't exist"
   Exit Sub
  End If
  
  
  i = lngSetLine
 'F(sokudo)
 ws.Cells(i, 1) = "H100=" & EpackArray(0, 1)
 ws.Cells(i + 1, 1) = "H101=" & EpackArray(1, 1)
 ws.Cells(i + 2, 1) = "H102=" & EpackArray(2, 1)
 ws.Cells(i + 3, 1) = "H103=" & EpackArray(3, 1)
 ws.Cells(i + 4, 1) = "H104=" & EpackArray(4, 1)
 
 ws.Cells(i + 6, 1) = "H200=" & EpackArray(0, 0)
 ws.Cells(i + 7, 1) = "H201=" & EpackArray(1, 0)
 ws.Cells(i + 8, 1) = "H202=" & EpackArray(2, 0)
 ws.Cells(i + 9, 1) = "H203=" & EpackArray(3, 0)
 ws.Cells(i + 10, 1) = "H204=" & EpackArray(4, 0)
 
 ws.Cells(i + 12, 1) = "H300=" & Format(EpackArray(1, 2), "0.000") '1st-1st
 ws.Cells(i + 13, 1) = "H301=" & Format(EpackArray(1, 3), "0.000") '2nd-1st
 ws.Cells(i + 14, 1) = "H302=" & Format(EpackArray(2, 3), "0.000") '2nd-2nd
 ws.Cells(i + 15, 1) = "H331=" & Format(EpackArray(1, 4), "0.000") '3rd-1st
 ws.Cells(i + 16, 1) = "H332=" & Format(EpackArray(2, 4), "0.000") '3rd-2nd
 ws.Cells(i + 17, 1) = "H333=" & Format(EpackArray(3, 4), "0.000") '3rd-3rd
 ws.Cells(i + 18, 1) = "H341=" & Format(EpackArray(1, 5), "0.000") '4th-1st
 ws.Cells(i + 19, 1) = "H342=" & Format(EpackArray(2, 5), "0.000") '4th-2nd
 ws.Cells(i + 20, 1) = "H343=" & Format(EpackArray(3, 5), "0.000") '4th-3rd
 ws.Cells(i + 21, 1) = "H344=" & Format(EpackArray(4, 5), "0.000") '4th-4th
 
 
 
' CellY = 6
' CellX = 1
' For j = 0 To 4
'    For k = 0 To 5
    
'   ws.Cells(CellY, CellX) = EpackArray(j, k)
'    CellX = CellX + 1
'    Next k
'    CellX = 1
'    CellY = CellY + 1
'   Next j
 Exit Sub
 
trap:
  
  Call ErrSyori("sSetDaiEHValue", Err.Description)
  
End Sub
' Don't use(2017/03/10)
Private Sub sSetPunchEHValue(ByVal lngSetLine As Long)

Dim ws As Worksheet
 Dim WS2 As Worksheet
 Dim strThickness As String
 Dim i As Long
 Dim EpackArray(4, 5)
 Dim j As Integer
 Dim k As Integer
 Dim CellX As Long
 Dim CellY As Long
 
 If InStr(cstrThick, "m") = 0 Then
  strThickness = cstrThick & "mm"
 Else
  strThickness = cstrThick
 End If
 
 CellY = 5
 CellX = 2
 Set ws = ThisWorkbook.Worksheets(1)
 Set WS2 = ThisWorkbook.Worksheets(2)
 
 i = 1
 Do While 1 = 1
  
  If WS2.Cells(i, 7) = strThickness Then
   CellY = i + 3
   CellX = 2
   For j = 0 To 4
    For k = 0 To 5
    
    If WS2.Cells(CellY, CellX) & "" <> "" Then
     EpackArray(j, k) = CStr(WS2.Cells(CellY, CellX))
    Else
     EpackArray(j, k) = ""
    End If
    
    CellX = CellX + 1
    Next k
    CellX = 2
    CellY = CellY + 1
   Next j
  Exit Do
  End If
  
  i = i + 1
  
  If i >= 20000 Then
   Exit Do
  End If
  
 Loop
 
  i = lngSetLine
  
' ws.Cells(i, 1) = "H100=" & EpackArray(0, 1)
' ws.Cells(i + 1, 1) = "H101=" & EpackArray(1, 1)
' ws.Cells(i + 2, 1) = "H102=" & EpackArray(2, 1)
' ws.Cells(i + 3, 1) = "H103=" & EpackArray(3, 1)
' ws.Cells(i + 4, 1) = "H104=" & EpackArray(4, 1)
 
 'F(sokudo)
 ws.Cells(i, 1) = "H100=" & EpackArray(0, 1) 'Offset nashi
 ws.Cells(i + 1, 1) = "H101=" & EpackArray(1, 1) '1st
 ws.Cells(i + 2, 1) = "H102=" & EpackArray(2, 1) '2nd
 ws.Cells(i + 3, 1) = "H103=" & EpackArray(3, 1) '3rd
 ws.Cells(i + 4, 1) = "H104=" & EpackArray(4, 1) '4th


 'E Pack
 ws.Cells(i + 6, 1) = "H200=" & EpackArray(0, 0) 'Offset nashi
 ws.Cells(i + 7, 1) = "H201=" & EpackArray(1, 0) '1st
 ws.Cells(i + 8, 1) = "H202=" & EpackArray(2, 0) '2nd
 ws.Cells(i + 9, 1) = "H203=" & EpackArray(3, 0) '3rd
 ws.Cells(i + 10, 1) = "H204=" & EpackArray(4, 0) '4th
 
 'Offset
' ws.Cells(i + 12, 1) = "H300=" & EpackArray(0, 1) 'Offset nashi
 ws.Cells(i + 12, 1) = "H301=" & EpackArray(1, 2) '1st-1st
 ws.Cells(i + 13, 1) = "H302=" & EpackArray(1, 3) '2nd-1st
 ws.Cells(i + 14, 1) = "H303=" & EpackArray(2, 3) '2nd-2nd
 ws.Cells(i + 15, 1) = "H304=" & EpackArray(1, 4) '3rd-1st
 ws.Cells(i + 16, 1) = "H305=" & EpackArray(2, 4) '3rd-2nd
 ws.Cells(i + 17, 1) = "H306=" & EpackArray(3, 4) '3rd-3rd
 ws.Cells(i + 18, 1) = "H307=" & EpackArray(1, 5) '4th-1st
 ws.Cells(i + 19, 1) = "H308=" & EpackArray(2, 5) '4th-2nd
 ws.Cells(i + 20, 1) = "H309=" & EpackArray(3, 5) '4th-3rd
 ws.Cells(i + 21, 1) = "H310=" & EpackArray(4, 5) '4th-4th
 
End Sub

Private Sub sSetZValue(ByVal ws As Worksheet, ByVal WS2 As Worksheet, ByVal lngStart As Long)

 Dim i As Integer
 Dim varArray()
 Dim j As Long
 Dim DblJValue As Double
 
  i = 1
  Do While 1 = 1
   
   ReDim Preserve varArray(i)
   
   varArray(i) = ws.Cells(i, 1)
 '  Debug.Print varArray(i)
   
   If InStr(ws.Cells(i, 1), "G92") <> 0 And InStr(ws.Cells(i, 1), "J") <> 0 Then
    Exit Do
   End If
   
   i = i + 1
   
   If i > 200 Then
    Exit Do
   End If
  Loop
  j = lngStart + 1
  For i = 0 To UBound(varArray)
   DblJValue = fcheckJValue(varArray(i))
   If InStr(varArray(i), "IJ") <> 0 Or (InStr(varArray(i), "IJ") = 0 And DblJValue <> 0 And InStr(varArray(i), "G92") <> 0) Then
     
     If InStr(varArray(i), "IJ") <> 0 Then
      WS2.Cells(j, 1) = "Z1=" & fGetIJvalue(varArray(i))
     Else
      If InStr(CStr(DblJValue), ".") <> 0 Then
       WS2.Cells(j, 1) = "Z1=" & DblJValue
      Else
       WS2.Cells(j, 1) = "Z1=" & DblJValue & "."
      End If
     End If
     
   End If
   
   If InStr(varArray(i), "ITAATU") <> 0 Then
     
     WS2.Cells(j + 2, 1) = "Z2=" & CInt(Mid(varArray(i), InStr(varArray(i), "=") + 1, InStr(varArray(i), ".") - InStr(varArray(i), "=") - 1)) / 2
     
     If CInt(Mid(varArray(i), InStr(varArray(i), "=") + 1, InStr(varArray(i), ".") - InStr(varArray(i), "=") - 1)) Mod 2 = 0 Then
      WS2.Cells(j + 2, 1) = WS2.Cells(j + 2, 1) & "."
     End If
     WS2.Cells(j + 3, 1) = "Z5=" & Mid(varArray(i), InStr(varArray(i), "=") + 1, InStr(varArray(i), ".") - InStr(varArray(i), "="))
     j = j + 1
   End If
   
   
  Next i
  
End Sub

Private Function fGetIJvalue(ByVal chkstr As String)
 
 Dim intLength As Integer
 Dim strSet As String
 
  
  intLength = Len(chkstr) - InStr(chkstr, "J")
  strSet = Right(chkstr, intLength)
  
  fGetIJvalue = Left(strSet, InStr(strSet, "J") - 1)
  
  
End Function

Private Function fSetProgramStart(ByVal WS2J As Long)
 
 Dim i As Integer
 Dim ws As Worksheet
 
 Set ws = ThisWorkbook.Worksheets(3)
 
 i = 1
 On Error GoTo trap
  Do While i < 1000
   
   If mchkTepa = False And InStr(ws.Cells(i, 1), "G92") <> 0 Then
     Call sSetSyokiIti(i, WS2J)
   End If
   
   If mchkTepa = True And Left(ws.Cells(i, 1), 1) = "(" Then
    Exit Do
   ElseIf mchkTepa = False And ws.Cells(i, 1) = "M80" Then
    Exit Do
   End If
   i = i + 1
  Loop
  
  fSetProgramStart = i
  
  Exit Function
  
trap:
   
   Call ErrSyori("fSetProgramStart", Err.Description)
   
End Function

Private Sub sSetDaiEH(ByVal wsI As Long, ByVal WS2J As Long, ByVal strLine As String)

Dim ws As Worksheet
Dim i As Long
Dim j As Long
Dim WS2 As Worksheet
 'wsI = Genzai no yomikonda File no henkan siteiru Cell no basyo
 'WS2J = Genzai kakikondeiru Cell no basyo
 Set ws = ThisWorkbook.Worksheets(3)
 Set WS2 = ThisWorkbook.Worksheets(1)
 i = wsI
 j = WS2J
 
'  Do While 1 = 1
    
 '  If strLine = "S01" Then
 '   If InStr(ws.Cells(i, 1), "G91") <> 0 Then
 '    Exit Do
    
 '   ElseIf InStr(ws.Cells(i, 1), "M98") <> 0 Then
 '    Exit Do
 '   End If
    
 ' ElseIf InStr(strLine, "G") <> 0 And InStr(strLine, "S") <> 0 And InStr(strLine, "D") <> 0 Then
 '  If InStr(ws.Cells(i, 1), "G") = 0 And InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
 '   Exit Do
 '  ElseIf InStr(ws.Cells(i, 1), "M98") <> 0 Then
 '   Exit Do
 '  End If
''  ElseIf InStr(strLine, "G") = 0 And InStr(strLine, "S") <> 0 And InStr(strLine, "D") <> 0 Then
  
''  If InStr(ws.Cells(i, 1), "M98") <> 0 Then
''   Exit Do
''  End If
  
''   Exit Do
 
'  End If
  
'   i = i + 1
   
'   If i - wsI = 100 Then
'    Exit Do
'   End If
   
'  Loop
  
  
' On Error GoTo trap
  'If strLine = "S01" Then
  If Left(strLine, 1) = "S" And Len(strLine) = 3 Then
  ' If InStr(ws.Cells(i, 1), "M98") <> 0 Then
     WS2.Cells(j, 1) = "FH100"
    WS2.Cells(j + 1, 1) = "EH200"
 '  Else
 '   WS2.Cells(j, 1) = "FH100"
 '   WS2.Cells(j + 1, 1) = ws.Cells(i, 1) & "EH200"
  ' End If
   
'  ElseIf InStr(strLine, "G") <> 0 And InStr(strLine, "S") <> 0 And InStr(strLine, "D") <> 0 Then
  ElseIf InStr(strLine, "S") <> 0 And InStr(strLine, "D") <> 0 Then
   If InStr(ws.Cells(i, 1), "G") = 0 And InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
   
    WS2.Cells(j, 1) = fSetDaiFH(ws.Cells(i, 1), i)
    'WS2.Cells(j + 1, 1) = Left(strLine, InStr(strLine, "S") - 1) & fSetDaiEH(ws.Cells(i, 1))
    WS2.Cells(j + 1, 1) = fSetDaiEH(ws.Cells(i, 1))
   ElseIf InStr(ws.Cells(i, 1), "G") <> 0 And InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
    WS2.Cells(j, 1) = fSetDaiFH(strLine, i)
    If InStr(strLine, "T") = 0 Or Right(strLine, 1) = "." Then
     WS2.Cells(j + 1, 1) = fSetDaiEH(strLine)
     WS2.Cells(j + 2, 1) = Left(strLine, InStr(strLine, "S") - 1)
    Else
     WS2.Cells(j + 1, 1) = Left(strLine, InStr(strLine, "S") - 1) & fSetDaiEH(strLine)
    End If
   End If
   
'  ElseIf InStr(strLine, "G") = 0 And InStr(strLine, "S") <> 0 And InStr(strLine, "D") <> 0 Then
  
  End If
  
  Exit Sub
trap:
 
  Call ErrSyori("sSetDaiEH", Err.Description)
  
End Sub

Private Function fSetDaiEH(ByVal strLine As String)

 Dim intsetEH As Integer
 Dim intsetH As Integer
 Dim setLine As String
  
'  On Error GoTo trap
  
  If InStr(strLine, "S") < InStr(strLine, "D") Then
    intsetEH = 200 + CInt(Mid(strLine, InStr(strLine, "S") + 1, 2))
    intsetH = 300 + CInt(Mid(strLine, InStr(strLine, "D") + 1, 2))
  ElseIf InStr(strLine, "S") > InStr(strLine, "D") Then
    intsetEH = 200 + CInt(Mid(strLine, InStr(strLine, "S") + 1, Len(strLine) - InStr(strLine, "S")))
    intsetH = 300 + CInt(Mid(strLine, InStr(strLine, "D") + 1, Len(strLine) - InStr(strLine, "S")))
  End If
  
'  If InStr(strLine, "D00") <> 0 Then
'   intsetH = 301
'  End If
  
'  If InStr(strLine, "S00") <> 0 Then
'   intsetEH = 201
'  End If
  
  If InStr(strLine, "T") <> 0 Then
     
   setLine = Right(strLine, Len(strLine) - InStr(strLine, "T"))
    If IsNumeric(setLine) = True Then
     If CLng(setLine) <> 0 Then
     ' If InStr(strLine, "G41") <> 0 Then
     '   fSetDaiEH = "EH" & intsetEH & "H" & Format(intsetH, "000") & "A" & setLine
     '  End If
     ' ElseIf InStr(strLine, "G42") <> 0 Then
     '   fSetDaiEH = "EH" & intsetEH & "H" & Format(intsetH, "000") & "A-" & setLine
     ' End If
      
      If InStr(strLine, "G52") <> 0 Then
        fSetDaiEH = "EH" & intsetEH & "H" & Format(intsetH, "000") & "A" & setLine
      ElseIf InStr(strLine, "G51") <> 0 Then
        fSetDaiEH = "EH" & intsetEH & "H" & Format(intsetH, "000") & "A-" & setLine
      End If
      
     Else
      fSetDaiEH = "EH" & intsetEH & "H" & Format(intsetH, "000")
     End If
     
    End If
    
   Else
    fSetDaiEH = "EH" & intsetEH & "H" & Format(intsetH, "000")
   End If
   
  Exit Function
trap:

 Call ErrSyori("fsetDaiEH", Err.Description)
 
End Function

Private Function fSetDaiFH(ByVal strLine As String, ByVal wsI As Long)
 
 Dim ws As Worksheet
 Dim intsetFH As Integer
 
 
  
 Set ws = ThisWorkbook.Worksheets(3)
   On Error GoTo trap
  ' If InStr(ws.Cells(wsI + 1, 1), "M98") = 0 Then
     If InStr(strLine, "S") < InStr(strLine, "D") Then
     intsetFH = 100 + CInt(Mid(strLine, InStr(strLine, "S") + 1, 2))
    ElseIf InStr(strLine, "S") > InStr(strLine, "D") Then
     intsetFH = 100 + CInt(Mid(strLine, InStr(strLine, "S") + 1, 2))
    End If
  ' Else
  '  intsetFH = 1
 '  End If
  If InStr(strLine, "T") <> 0 Then
   intsetFH = 101
  End If

  fSetDaiFH = "FH" & intsetFH
   
  Exit Function
  
trap:
  
  Call ErrSyori("fSetDaiFH ", Err.Description)
  
End Function

Private Sub sProgramFinish(ByVal WS2J As Long)

Dim i As Long
Dim j As Long
Dim ws As Worksheet
Dim WS2 As Worksheet

Set ws = ThisWorkbook.Worksheets(3)
Set WS2 = ThisWorkbook.Worksheets(1)

j = WS2J
i = 0
 On Error GoTo trap
 Do While i < 1000
  
 ' If ws.Cells(i, 1) = "M99" Then
 '  Exit Do
 ' End If
  
  If WS2.Cells(j, 1) = "G23" Then
   j = j + 1
   Exit Do
  Else
   WS2.Cells(j, 1) = ""
  End If
  
  j = j - 1
  i = i + 1
  
  If i >= 1000 Then
   Exit Do
  End If
 Loop
 
 
   WS2.Cells(j, 1) = "%"
  
  Exit Sub
  
trap:
 
 Call ErrSyori("sProgramFinish", Err.Description)
 
End Sub

Private Sub sKakoJoukenFinal(ByVal intchkFrom As Integer)

 Dim ws As Worksheet
 Dim i As Long
 Dim Count As Integer
 Dim M02chk As Boolean
 
 
 Set ws = ThisWorkbook.Worksheets(1)
 
' M02chk = False
 i = 1
 Count = 0
 mchkOukiri = False
  
' On Error GoTo trap
 Do While i < 20000
  If InStr(ws.Cells(i, 1), "(") <> 0 And InStr(ws.Cells(i, 1), "KIRI") <> 0 And Left(ws.Cells(i, 1), 1) <> "L" Then
  ' mchkoukiri = fSetOUKIRIvalue
  ' OUFUKU ¨ KIRIOTOSHI‚Ì‡‚©ƒ`ƒFƒbƒN‚µ,‚±‚Ì‡”Ô‚ÌŽž‚ÍKIRIOTOSHI‚É‰ÁHðŒ‚ðÝ’è‚·‚é
   Call sSetOUKIRIvalue(i, ws.Cells(i, 1), intchkFrom)
   If mblnChk6th = True Then
    Exit Sub
   End If
   
  End If
   
  If InStr(ws.Cells(i, 1), "(") <> 0 And InStr(ws.Cells(i, 1), "OUFUKU") = 0 And Left(ws.Cells(i, 1), 1) <> "L" And mchkOukiri = False Then
   ' EH wo tekisetsu na atai ni suru syori
    Call sSetEHTekisei(i, intchkFrom)
  '  m02chk = True
  End If
  
  If mchkoufuku = True Then
   mchkOukiri = False
  End If
  
'  If ws.Cells(i, 1) = "M02" Then
'    M02chk = True
'  End If
  
  If ws.Cells(i, 1) = "%" Then
   Count = Count + 1
  End If
  
  If Count = 2 Then
   Exit Do
  End If
 i = i + 1
  If ws.Cells(i, 1) = "M02" Then
   M02chk = True
  End If
  
  If i >= 20000 Then
   Exit Do
  End If
  
  If M02chk = True Then
   Exit Do
  End If
 If mchkOukiri = True Then
  mchkOukiri = False
 End If
 Loop
 
Exit Sub

trap:
 
 Call ErrSyori("sKakoJoukenFinal", Err.Description)
 
End Sub

Private Sub sSetEHTekisei(ByVal lngStart As Long, ByVal intchkFrom As Integer)
 
 ' intchkFrom 1:Dai 0:Punch
 Dim ws As Worksheet
 Dim i As Long
 Dim SetKakoline()
 Dim Kakocount As Integer
 Dim j As Long
 Dim startH As Integer
 Dim startEH As Integer
 Dim startFH As Integer
 Dim intACount As Integer 'te-pa-kakou no check
 Dim TePaLine()
 Dim chkNokoshi As Boolean
 Dim k As Integer
 Dim strFIG As String
 Dim intKakoCount As Integer
 Dim chkOUKIRI As Boolean
 Dim chkNextOUFUKU As Boolean ' ŽŸ‚ªOUFUKU‚¾‚Á‚½‚©‚Ìƒ`ƒFƒbƒN
 Dim strchkFIG As String
 Dim intFkakocount As Integer
 Dim chkOUA As Boolean
 Dim chkSakiTepa As Boolean
 
  If mchkOukiri = True Then
   mchkOukiri = False
   Exit Sub
  End If
  
  If mblnChk6th = True Then
   Exit Sub
  End If
  
  Set ws = ThisWorkbook.Worksheets(1)
  strchkFIG = Mid(ws.Cells(lngStart, 1), InStr(ws.Cells(lngStart, 1), "(") + 1, 8)
  strchkFIG = Trim(strchkFIG)
  
  i = lngStart
  Kakocount = 0
  chkNokoshi = False
  If InStr(ws.Cells(i, 1), "NOKOSHI") <> 0 Then
   chkNokoshi = True
  End If
  Kakocount = 0
  intACount = 0
  chkNextOUFUKU = False
  chkOUA = False
  chkSakiTepa = False
'  On Error GoTo trap
  Do While 1 = 1
     If Left(ws.Cells(i, 1), 1) = "(" And InStr(ws.Cells(i, 1), "M0") = 0 Then
      strFIG = ws.Cells(i, 1)
     End If
 '  If InStr(ws.Cells(i, 1), "FH") <> 0 And InStr(ws.Cells(i + 1, 1), "EH") <> 0 Then
   If InStr(ws.Cells(i, 1), "FH") <> 0 And InStr(ws.Cells(i + 1, 1), "EH") <> 0 Then
'   And InStr(ws.Cells(i + 1, 1), "A") = 0
      If Right(ws.Cells(i, 1), 2) <> "00" Then
       If InStr(ws.Cells(i + 1, 1), "A") = 0 Then
        ReDim Preserve SetKakoline(Kakocount)
        SetKakoline(Kakocount) = i
        Kakocount = Kakocount + 1
       ElseIf InStr(ws.Cells(i + 1, 1), "A") <> 0 Then
        If Kakocount = 0 Then
         chkSakiTepa = True
        End If
       ReDim Preserve TePaLine(intACount)
        TePaLine(intACount) = i
        intACount = intACount + 1
       End If
      
       If Kakocount > 4 Then
        Exit Do
       End If
       
      End If
      
'      If Right(ws.Cells(i, 1), 2) = "00" Then
 '      If ws.Cells(i + 1, 1) <> "EH200H200" Or ws.Cells(i + 1, 1) <> "EH200" Then
 '       ReDim Preserve SetKakoline(Kakocount)
  '      SetKakoline(Kakocount) = i
  '      Kakocount = Kakocount + 1
  '     End If
  '    End If
      
   End If
   
   If InStr(ws.Cells(i, 1), "G22") <> 0 And intFrom = 0 Then
      If fchkSubProgram(CStr(Mid(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "H") + 1, 4)), i) = True Then
       Exit Sub
      End If
   End If
   
   i = i + 1
   
   If InStr(ws.Cells(i, 1), "(") <> 0 And InStr(ws.Cells(i, 1), "OUFUKU") = 0 Then
 '  If ws.Cells(i, 1) = "M02" Then
    Exit Do
   ElseIf InStr(ws.Cells(i, 1), strchkFIG) = 0 And InStr(ws.Cells(i, 1), "(") <> 0 Then
  '  chkNokoshi = False
    Exit Do
   ElseIf InStr(ws.Cells(i, 1), "(") <> 0 And InStr(ws.Cells(i, 1), "OUFUKU") <> 0 And InStr(ws.Cells(i, 1), strchkFIG) <> 0 Then
    chkNextOUFUKU = True
   End If
   
   If i - lngStart >= 20000 Then
    Exit Do
   End If
   
  Loop
 

 '   If fChkOUFUKU(strFIG, i, intKakocount, Kakocount) = False Then
    
'  If Kakocount = 0 And intACount = 0 Then
   ' And intACount = 0
'   Exit Sub
'  End If
  '3/22 chknokoshi = false add 3/23 ‡”ÔŒðŠ·
  If (Kakocount <> 0 And chkNextOUFUKU = False) Or (intACount <> 0 And chkNextOUFUKU = False) Then
    If fChkOUFUKU(strFIG, i, intKakoCount, Kakocount, intACount) = True And chkNokoshi = False Then
     If Kakocount <> 0 Then
      Kakocount = Kakocount + intKakoCount
   '  ElseIf Kakocount = 0 And intACount <> 0 Then
   '   Kakocount = intACount + intKakoCount
     End If
    End If
  End If
   
  
  If chkNokoshi = True And Kakocount <> 0 Then
   If fSetKakoCount(ws.Cells(lngStart, 1), intFkakocount, chkOUA) <> 0 Then
'    Kakocount = fSetKakoCount(ws.Cells(lngStart, 1))
    If chkNextOUFUKU = False Then
     Kakocount = intFkakocount
'    ElseIf chkNextOUFUKU = False And Kakocount + intFkakocount < 5 Then
    End If
   End If
  End If
    
  If Kakocount > 4 And mblnChk6th = False Then
   MsgBox "error"
   Exit Sub
  End If
  
   
  'ƒJƒbƒg‰ñ”‚©‚ç‚g‚ÌŽn‚Ü‚é”Žš‚ðŒˆ‚ß‚é
  Select Case Kakocount
  
  Case 1
   startFH = 101
   startEH = 201
   startH = 300
  Case 2
   startFH = 101
   startEH = 201
   startH = 301
  Case 3
   startFH = 101
   startEH = 201
   startH = 331
  Case 4
   startFH = 101
   startEH = 201
   startH = 341
  Case Else
   startFH = 100
   startEH = 200
   startH = 300
  End Select
  
  
  
 If Kakocount <> 0 Then
  For i = 0 To UBound(SetKakoline)
   j = SetKakoline(i)
'   ws.Cells(j, 1) = "FH" & StartFH + i
  If InStr(ws.Cells(j + 1, 1), "A") = 0 Then
'  If intACount = 0 Then
  ' If chkNokoshi = True And intchkFrom = 1 Then
  '   ws.Cells(j, 1) = "FH" & StartFH + i
  '   ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & Format(StartEH + i, "000") & "H" & Format(StartH + i + 1, "000")
  ' Else
   If ws.Cells(j - 1, 1) = "F200000" Then
      ws.Cells(j, 1) = ""
   Else
     ws.Cells(j, 1) = "FH" & startFH + i
   End If
    ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & Format(startEH + i, "000") & "H" & Format(startH + i, "000")
'   ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "H") + 3) & "H" & Format(StartH + i, "000")
  ' End If
'  Else ' Te-pa- kakou no Jouken (Ima ha Koteiti nanode Syusei ari)
 '   ws.Cells(j, 1) = "FH" & "101"
  ' ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & Format(StartEH + i, "000") & "H" & Format(StartH + i, "000") & Right(ws.Cells(j + 1, 1), Len(ws.Cells(j + 1, 1)) - InStr(ws.Cells(j + 1, 1), "A") + 1)
 '   ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & "201" & "H" & "301" & Right(ws.Cells(j + 1, 1), Len(ws.Cells(j + 1, 1)) - InStr(ws.Cells(j + 1, 1), "A") + 1)
  End If
  Next i
End If
  j = fSetKakoCount(ws.Cells(lngStart, 1), intFkakocount, chkOUA)
' +intAcount add
 If intACount <> 0 Then
  If Kakocount = 0 And chkOUA = True Then
   Kakocount = intACount + fSetKakoCount(ws.Cells(lngStart, 1), intFkakocount, chkOUA)
    Select Case Kakocount
    
    Case 1
     startH = 300
     startFH = 101
     startEH = 201
    Case 2
     startH = 301
     startFH = 101
     startEH = 201
    Case 3
     startH = 331
     startFH = 101
     startEH = 201
    Case 4
     startH = 341
     startFH = 101
     startEH = 201
    Case Else
     startH = 300
     startFH = 100
     startEH = 200
    End Select
  Else
   Select Case Kakocount
    Case 0
     startH = 300
     startFH = 100
     startEH = 200
    Case 1
     startH = 300
     startFH = 101
     startEH = 201
    Case 2
     startH = 302
     startFH = 102
     startEH = 202
    Case 3
     startH = 333
     startFH = 103
     startEH = 203
    Case 4
     startH = 344
     startFH = 104
     startEH = 204
    End Select
  End If
  
 For i = 0 To UBound(TePaLine)
  j = TePaLine(i)
    ws.Cells(j, 1) = "FH" & startFH
   If Kakocount >= 4 Then
    If chkSakiTepa = True Then
     ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH201" & "H" & startH & Right(ws.Cells(j + 1, 1), Len(ws.Cells(j + 1, 1)) - InStr(ws.Cells(j + 1, 1), "A") + 1)
    Else
     ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH202" & "H" & startH & Right(ws.Cells(j + 1, 1), Len(ws.Cells(j + 1, 1)) - InStr(ws.Cells(j + 1, 1), "A") + 1)
    End If
    
   Else
   ' ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & Format(StartEH, "000") & "H" & Format(StartH, "000") & Right(ws.Cells(j + 1, 1), Len(ws.Cells(j + 1, 1)) - InStr(ws.Cells(j + 1, 1), "A") + 1)
    ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & startEH & "H" & startH & Right(ws.Cells(j + 1, 1), Len(ws.Cells(j + 1, 1)) - InStr(ws.Cells(j + 1, 1), "A") + 1)
   End If
 Next i
 
 End If
 Exit Sub
trap:
 
  Call ErrSyori("sSetEHTekisei", Err.Description)
  
End Sub

Public Sub sSetKakoJoukenSubProgram()
 
 Dim ws As Worksheet
 Dim i As Long
 Dim lngStart As Long
 Dim M02chk As Boolean
 Dim chkFinish As Boolean
 
 Set ws = ThisWorkbook.Worksheets(1)
 M02chk = False
 chkFinish = False
 
 i = 1
 Do While M02chk = False
  If ws.Cells(i, 1) = "M02" Then
   M02chk = True
  End If
  i = i + 1
  
  If i >= 20000 Then
   Exit Do
  End If
  
 Loop
 
 lngStart = i
 
 Do While chkFinish = False
  
  If InStr(ws.Cells(lngStart, 1), "EH") <> 0 Then
 '  Debug.Print lngStart
   Call sChangeEHSubProgarm(lngStart)
  End If
  
  If ws.Cells(lngStart, 1) = "%" Then
   chkFinish = True
  End If
  
  lngStart = lngStart + 1
  
  If lngStart > 20000 Then
   Exit Do
  End If
 Loop
 
End Sub

Private Sub sGetEHSubProgarm(ByVal lngStart As Long)

Dim lngEH As Long
Dim lngFH As Long
Dim chkSubStart As Boolean
Dim strSubName As String
Dim i As Long
Dim ws As Worksheet
Dim strSubPno As String

Set ws = ThisWorkbook.Worksheets(1)

lngEH = lngStart
i = lngStart
chkSubStart = False
lngFH = 0

 Do While chkSubStart = False
  
'  If InStr(ws.Cells(i, 1), "FH") <> 0 Then
'   lngFH = i
'  End If
  
  If InStr(ws.Cells(i, 1), "N") <> 0 Then
   strSubName = ws.Cells(i, 1)
   chkSubStart = True
  End If
  
  i = i - 1
  If lngEH - i > 200 Then
   Exit Do
  End If
  
 Loop
 
 If strSubName & "" = "" Then
  Exit Sub
 End If
 
 strSubPno = Format(Replace(strSubName, "N", ""), "0000")
 
End Sub

Private Sub sChangeEHSubProgram(ByVal SubEH As Long, ByVal SubFH As Long, ByVal strSubPno As String)

 Dim ws As Worksheet
 Dim i As Long
 Dim strMainEH As String
' Dim strMainFH As String
 Dim strchkCallsub As String
 Dim chkGetCallsub As Boolean
 Dim intMainEH As Integer
 
  Set ws = ThisWorkbook.Worksheets(1)
  strchkCallsub = "H" & strSubPno
  i = 1
  chkGetCallsub = False
  On Error GoTo trap
  Do While chkGetCallsub = False
   
   If InStr(ws.Cells(i, 1), "EH") <> 0 Then
    
    If Left(ws.Cells(i, 1), 1) = "G" Then
     strMainEH = Right(ws.Cells(i, 1), Len(ws.Cells(i, 1)) - InStr(ws.Cells(i, 1), "E") + 1)
    ElseIf Left(ws.Cells(i, 1), 1) = "E" Then
     strMainEH = ws.Cells(i, 1)
    End If
    
   If InStr(ws.Cells(i, 1), strchkCallsub) <> 0 Then
    chkGetCallsub = True
   End If
   
   If ws.Cells(i, 1) = "M02" Then
    Exit Do
   End If
   
   i = i + 1
  Loop
  Exit Sub
trap:

  Call ErrSyori("sChangeEHSubProgram", Err.Description)
 
End Sub
 

Private Function fChkSubEHset(ByVal strchkSub As String) As Boolean
 
 Dim chkSubPNo As Integer
 Dim ws As Worksheet
 Dim i As Long
 Dim M02chk As Boolean
 Dim lngchkStart As Long
 Dim lngchkEnd As Long
 Dim setchkEH As Boolean
 
  Set ws = ThisWorkbook.Worksheets(3)
  
  On Error GoTo trap
  chkSubPNo = CInt(Right(strchkSub, Len(strchkSub) - InStr(strchkSub, "P")))
  
 i = 1
 M02chk = False
 lngchkStart = 0
 lngchkEnd = 0
 
 Do While i < 10000
  
  If ws.Cells(i, 1) = "M02" Then
   M02chk = True
  End If
  
  If M02chk = True And (ws.Cells(i, 1) = "O" & chkSubPNo Or ws.Cells(i, 1) = "O" & Format(chkSubPNo, "0000")) Then
    lngchkStart = i
  End If
  
  If M02chk = True And lngchkStart <> 0 And ws.Cells(i, 1) = "M99" Then
   lngchkEnd = i
   Exit Do
  End If
  
  i = i + 1
  If i > 1000 Then
   Exit Do
  End If
 Loop
 
  If lngchkStart = 0 Or lngchkEnd = 0 Then
   fChkSubEHset = False
   Exit Function
  End If
  
  For i = lngchkStart To lngchkEnd
  
   If InStr(ws.Cells(i, 1), "S") <> 0 And InStr(ws.Cells(i, 1), "D") <> 0 Then
     fChkSubEHset = True
     Exit For
   End If
  Next i
  
 Exit Function
 
trap:
  
  Call ErrSyori("fChkSubEHset", Err.Description)
 
End Function

Private Sub sSetHeikou(ByVal WS2J As Long)

Dim i As Long
Dim ws As Worksheet
Dim WS2 As Worksheet
Dim j As Long
Dim chkHeikouUMU As Boolean
Dim Setvalue As String
Dim chkTepa As Boolean
Dim strTepa As String

i = 1
j = WS2J
mChkHeikou = False
chkHeikouUMU = False

Set ws = ThisWorkbook.Worksheets(3)
Set WS2 = ThisWorkbook.Worksheets(1)
chkTepa = False

Do While i < 1000
 
 If InStr(ws.Cells(i, 1), "P6000") <> 0 Then
  chkHeikouUMU = True
'  Exit Do
 End If
 

If ws.Cells(i, 1) = "M15P1" Then
 mchkTepa = True
End If

If InStr(ws.Cells(i, 1), "IJ") <> 0 Or (InStr(ws.Cells(i, 1), "IJ") = 0 And fcheckJValue(ws.Cells(i, 1)) <> 0 And InStr(ws.Cells(i, 1), "G92") <> 0) Then
   strTepa = Left(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "I") - 1)
 
End If

If ws.Cells(i, 1) = "M80" Then
 Exit Do
End If

i = i + 1
Loop

If chkHeikouUMU = False Then
 Exit Sub
End If

Setvalue = fSetHeikouValue(ws)

If Setvalue & "" = "" Then
 Exit Sub
End If

WS2.Cells(j, 1) = "H902 = " & Setvalue
WS2.Cells(j + 1, 1) = "G22L6000"
WS2.Cells(j + 2, 1) = "KH220"

If mchkTepa = True Then
 WS2.Cells(j + 3, 1) = "G90" & strTepa
End If

mChkHeikou = True
End Sub

Private Function fSetHeikouValue(ByVal ws As Worksheet)

 Dim i As Long
 Dim Count As Integer
 Dim strSet As String
 
 i = 1
 Count = 0
 On Error GoTo trap
 Do While i < 20000
 
 If ws.Cells(i, 1) = "%" Then
  Count = Count + 1
 End If
 
 If Count >= 2 Then
  Exit Do
 End If
 
 If InStr(ws.Cells(i, 1), "#009") <> 0 Then
  Exit Do
 End If
 
 i = i + 1
 Loop
 
 strSet = Mid(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "=") + 1, InStr(ws.Cells(i, 1), "(") - InStr(ws.Cells(i, 1), "=") - 1)
 
 fSetHeikouValue = strSet
 
 Exit Function
 
trap:
 
 Call ErrSyori("fSetHeikouValue", Err.Description)
 
End Function

Private Function fSetPunchProgramStart(ByVal ws As Worksheet, ByVal wsI As Long)

 Dim i As Long
 Dim chkStart As Boolean
 
 i = 1
 chkStart = False
 On Error GoTo trap
If mChkHeikou = True Then
  Do While i < 100
 
  If InStr(ws.Cells(i, 1), "G90G00") <> 0 Then
   chkStart = True
   Exit Do
  End If
 
  i = i + 1
  Loop
 Else
  Do While i < 1000
 
  If InStr(ws.Cells(i, 1), "(") <> 0 And Left(ws.Cells(i, 1), 1) = "(" Then
  ' And Left(ws.Cells(i, 1), 1) <> "O"
   chkStart = True
   Exit Do
  End If
 
  i = i + 1
  Loop
End If

 If chkStart = False Then
  i = wsI
 End If
 
 If mChkHeikou = True Then
  fSetPunchProgramStart = i - 1
 Else
  fSetPunchProgramStart = i
 End If
 
 Exit Function
 
trap:
 
 Call ErrSyori("fSetPunchProgramStart", Err.Description)
 
End Function

Private Function fSetKakoCount(ByVal strLine As String, intFkakocount As Integer, chkOUA As Boolean)

Dim ws As Worksheet
Dim strchkKako As String
Dim i As Long
Dim chkUMU As Boolean
Dim Kakocount As Integer
Dim chkNextOUFUKU As Boolean
Dim CountStart As Long
Dim j As Long
Dim intchkLen As Integer
Dim strchkKako2 As String ' ƒ‹[ƒv“à‚Ìƒ`ƒFƒbƒN‚É—˜—p
Dim chkRenzoku As Boolean
Dim chkOUFUKUA As Boolean
Dim chkFIG As Boolean

Set ws = ThisWorkbook.Worksheets(1)

 If InStr(strLine, "FIG") <> 0 Then
  chkFIG = True
 Else
  chkFIG = False
 End If
 
 
'On Error GoTo trap
' FIG‚Ì‚¢‚­‚Â‚Ì‰ÁH‚È‚Ì‚©‚ðŠm”F(FIG-1 1st`)‚Ì"FIG1 "‚Ü‚ÅŽæ“¾(Œ…”‚ª3Œ…‚Å‚à–â‘è‚È‚­Žæ“¾‚Å‚«‚é‚æ‚¤‚É‚·‚é‚½‚ß8•¶Žš‚É‚µ‚Ä‚¢‚é)
strchkKako = Mid(strLine, InStr(strLine, "(") + 1, 8)
' ”¼ŠpƒXƒy[ƒX‚ªŠÜ‚Ü‚ê‚éê‡‚ª‚ ‚é‚Ì‚ÅTrim‚Åíœ
If InStr(strchkKako, "FIG") <> 0 Then
 intchkLen = CInt(Trim(Mid(strchkKako, InStr(strchkKako, "-") + 1, 3)))
End If
strchkKako = Trim(strchkKako)
'ƒ‹[ƒvƒJƒEƒ“ƒ^‚ÌÝ’è
i = 1
chkUMU = False
Kakocount = 0
Do While i < 20000
' strChkKako2 = Mid(ws.Cells(i, 1), InStr(strLine, "(") + 1, 8)
'FIG- ‚Å‡‚Á‚Ä‚¢‚é‚à‚Ì‚ð’T‚µ‚ÄNOKOSHIˆÈŠO‚ªŒ©‚Â‚©‚Á‚½‚çƒtƒ‰ƒO‚ðtrue‚É
 If InStr(ws.Cells(i, 1), strchkKako) <> 0 And InStr(ws.Cells(i, 1), "NOKOSHI") = 0 Then
  If chkFIG = False Then
   GoTo skip
  End If
  
  If CInt(Trim(Mid(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "-") + 1, 3))) = intchkLen Then
skip:
     j = i
     chkUMU = True
     CountStart = i
     Do While 1 = 1
   
      If InStr(ws.Cells(j, 1), "FH") <> 0 And InStr(ws.Cells(j + 1, 1), "EH") <> 0 Then
    '   And InStr(ws.Cells(i + 1, 1), "A") = 0
       If Right(ws.Cells(j, 1), 2) <> "00" Then
        If InStr(ws.Cells(j + 1, 1), "A") = 0 Then
         Kakocount = Kakocount + 1
    '    ElseIf InStr(ws.Cells(i + 1, 1), "A") <> 0 Then
        ElseIf InStr(ws.Cells(i, 1), "OUFUKU") <> 0 And InStr(ws.Cells(j + 1, 1), "A") <> 0 Then
         chkOUFUKUA = True
        End If
       
        If Kakocount > 4 Then
         Exit Do
        End If
       
       End If
      
     End If

   j = j + 1
   
  ' If InStr(ws.Cells(CountStart, 1), "OUFUKU") <> 0 And InStr(ws.Cells(j, 1), "KIRI") <> 0 And InStr(ws.Cells(j, 1), strchkKako) <> 0 Then
  
   If InStr(ws.Cells(j, 1), "(") <> 0 Then
    ' And InStr(ws.Cells(i, 1), "OUFUKU") = 0
    Exit Do
  '  chkNextOUFUKU = True
   End If
   
   If j - lngStart >= 20000 Then
    Exit Do
   End If
   
   If ws.Cells(j, 1) = "M02" Then
    Exit Do
   End If
   
  Loop
 ' chkUMU = True
 End If
 End If
 
 If ws.Cells(i, 1) = "M02" Then
  Exit Do
 End If
 
 i = i + 1
Loop

' ã‚Å’T‚µ‚Ä‚È‚©‚Á‚½ê‡0‚ð•Ô‚µ‚ÄI—¹
 If chkUMU = False Then
  fSetKakoCount = 0
  Exit Function
 End If
 
 
  ' Œ‹‰Ê‚ð•Ô‚·
  fSetKakoCount = Kakocount
  intFkakocount = Kakocount
  chkOUA = chkOUFUKUA
 Exit Function
 
trap:
  
  Call ErrSyori("fSetKakoCount", Err.Description)
  
End Function

Private Function fSetThickness()

 Dim intThick As Integer
 Dim strThick As String
  On Error GoTo trap
  If InStr(cstrThick, "m") <> 0 Then
    strThick = Left(cstrhick, InStr(cstrThick, "m") - 1)
  Else
   strThick = cstrThick
  End If
  
   If IsNumeric(strThick) = True Then
    intThick = CInt(strThick)
   End If
   
   If intThick = 5 Then
    fSetThickness = intThick
    Exit Function
   End If
   
   If CInt(Right(intThick, 1)) < 5 Then
     intThick = intThick - CInt(Right(intThick, 1))
   ElseIf CInt(Right(intThick, 1)) >= 5 Then
     intThick = intThick + 10 - CInt(Right(intThick, 1))
   End If
   
   fSetThickness = intThick
  Exit Function
trap:

 Call ErrSyori("fSetThickness", Err.Description)
   
End Function

Private Function fChkOUFUKU(ByVal Str As String, ByVal wsJ As Long, intKakoCount As Integer, ByVal Count As Integer, ByVal intTepaCount As Integer) As Boolean


Dim strchkKako As String
Dim ws As Worksheet
Dim i As Long
Dim Kakocount As Integer
Dim Loopcount As Long
Dim chkUMU As Boolean
Dim OUFUKUKako()
Dim j As Long
Dim ALine()
Dim intACount As Integer
Dim startH As Integer
Dim startEH As Integer
Dim startFH As Integer
Dim strchkKako2 As String
Dim chkKakoCount As Integer
Dim chkOUFUKUA As Boolean

 Set ws = ThisWorkbook.Worksheets(1)
 
 If InStr(Str, "F") <> 0 Then
  strchkKako = Mid(Str, InStr(Str, "F"), 7)
  strchkKako = Trim(strchkKako)
 Else
  strchkKako = Mid(Str, InStr(Str, "(") + 1, 8)
  strchkKako = Trim(strchkKako)
 End If
 
  
   chkOUFUKUA = False
   Kakocount = 0
   i = wsJ
   chkUMU = False
   intACount = 0
'   On Error GoTo trap
  ' “¯‚¶‰ÁH(FIG-*)‚ÌOUFUKU‚ª‚ ‚é‚©‚È‚¢‚©ƒ`ƒFƒbƒN‚µA‚ ‚Á‚½‚ç‚»‚Ì’†‚Ì‰ÁH‰ñ”‚ðƒJƒEƒ“ƒg
   Do While i < 20000
   
   If InStr(ws.Cells(i, 1), strchkKako) <> 0 And InStr(ws.Cells(i, 1), "OUFUKU") <> 0 Then
    strchkKako2 = Trim(Mid(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "(") + 1, 8))
   If strchkKako = strchkKako2 Then
    Loopcount = i
    chkUMU = True
    
    Do While Loopcount - i < 20000
       
       If InStr(ws.Cells(Loopcount, 1), "FH") <> 0 And InStr(ws.Cells(Loopcount + 1, 1), "EH") <> 0 Then
        If Right(ws.Cells(Loopcount, 1), 2) <> "00" Then
         If InStr(ws.Cells(Loopcount + 1, 1), "A") = 0 Then
         ReDim Preserve OUFUKUKako(Kakocount)
         OUFUKUKako(Kakocount) = Loopcount
         Kakocount = Kakocount + 1
        ElseIf InStr(ws.Cells(Loopcount + 1, 1), "A") <> 0 Then
         ReDim Preserve ALine(intACount)
         ALine(intACount) = Loopcount
         intACount = intACount + 1
         
         If InStr(ws.Cells(i, 1), "OUFUKU") <> 0 Then
          chkOUFUKUA = True
         End If
         
        End If
       End If
         If Kakocount > 4 Then
          Exit Do
         End If
       
         
        End If
      Loopcount = Loopcount + 1
      
      If InStr(ws.Cells(Loopcount, 1), "(") <> 0 Then
       Exit Do
      End If
      
    Loop
   End If
    Exit Do
   End If
   
   If ws.Cells(i, 1) = "M02" Then
    Exit Do
   End If
   i = i + 1
   Loop
   
  If chkUMU = False Then
  fChkOUFUKU = False
  Exit Function
  End If
  intKakoCount = Kakocount
  fChkOUFUKU = chkUMU
 
  If intTepaCount = 0 Then
   Kakocount = Kakocount + Count
  ElseIf intTepaCount <> 0 And Count = 0 And chkOUFUKUA = True Then
   Kakocount = Kakocount + intTepaCount
  ElseIf intTepaCount <> 0 And Count = 0 And chkOUFUKUA = False Then
   Kakocount = Kakocount + Count
  End If
  
  Select Case Kakocount
  
  Case 1
   startH = 300
  Case 2
   startH = 301
  Case 3
   startH = 331
  Case 4
   startH = 341
  Case Else
   startH = 300
  End Select
  
  
  startFH = 101
  startEH = 201
  If Kakocount <> 0 Then
   For i = 0 To UBound(OUFUKUKako)
    j = OUFUKUKako(i)
 '   If InStr(ws.Cells(j + 1, 1), "A") = 0 Then
   If Count <> 0 Or chkOUFUKUA = False Then
     ws.Cells(j, 1) = "FH" & startFH + i + Count
     ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & Format(startEH + i + Count, "000") & "H" & Format(startH + i + Count, "000")
   ElseIf Count = 0 And intTepaCount <> 0 And chkOUFUKUA = True Then
     ws.Cells(j, 1) = "FH" & startFH + i + intTepaCount
     ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & Format(startEH + i + intTepaCount, "000") & "H" & Format(startH + i + intTepaCount, "000")
   
    End If
   Next i
   
  End If
  
  If intACount <> 0 Then
   If Kakocount <> 0 Then
     Select Case Kakocount
  
     Case 1
      startH = 300
      startFH = 101
      startEH = 201
     Case 2
      startH = 302
      startFH = 102
      startEH = 202
     Case 3
      startH = 333
      startFH = 103
      startEH = 203
     Case 4
      startH = 344
      startFH = 104
      ' 2018/06/08 change 204 to 202
      startEH = 202
     Case Else
      startH = 300
     End Select
   Else
      startH = 300
      startFH = 101
      startEH = 201
   End If
    For i = 0 To UBound(ALine)
       j = ALine(i)
      ws.Cells(j, 1) = "FH" & startFH
      ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), InStr(ws.Cells(j + 1, 1), "E") - 1) & "EH" & startEH & "H" & startH & Right(ws.Cells(j + 1, 1), Len(ws.Cells(j + 1, 1)) - InStr(ws.Cells(j + 1, 1), "A") + 1)
    Next i
 
 End If

 Exit Function
 
trap:
 
 Call ErrSyori("fChkOUFUKU", Err.Description)

   
End Function

Private Sub sSetOUKIRIvalue(ByVal wsI As Long, ByVal strFIG As String, ByVal intFrom As Integer)

Dim startH As Integer
Dim startEH As Integer
Dim startFH As Integer
Dim ws As Worksheet
Dim i As Long
Dim strchkFIG As String
Dim strSetH()
Dim strOUH As String
Dim j As Long
Dim Count As Integer
Dim intchk As Integer
Dim SetH As String
Dim setFH As Integer
Dim setEH As Integer
 mchkOukiri = False
'On Error GoTo trap
strchkFIG = Mid(strFIG, InStr(strFIG, "(") + 1, 8)
'strChkFIG = Trim(strChkFIG)
 Set ws = ThisWorkbook.Worksheets(1)
 
 
 i = wsI
 Count = 0
 Do While i > 2
 If InStr(ws.Cells(i, 1), "(") <> 0 And InStr(ws.Cells(i, 1), "OUFUKU") <> 0 And InStr(ws.Cells(i, 1), strchkFIG) <> 0 Then
  If strchkFIG = Mid(ws.Cells(i, 1), InStr(ws.Cells(i, 1), "(") + 1, 8) Then
   strOUH = fGetOUKakoH(i)
  ' j = i
   j = wsI
  Do While j < 20000
     If InStr(ws.Cells(j, 1), "FH") <> 0 And InStr(ws.Cells(j + 1, 1), "EH") <> 0 Then
      If Right(ws.Cells(j, 1), 2) <> "00" Then
       If InStr(ws.Cells(j + 1, 1), "A") = 0 Then
        ReDim Preserve strSetH(Count)
        strSetH(Count) = j
        Count = Count + 1
       End If
      End If
     End If
      
    If InStr(ws.Cells(j, 1), "G22") <> 0 And intFrom = 0 Then
      If fchkSubProgram(CStr(Mid(ws.Cells(j, 1), InStr(ws.Cells(j, 1), "H") + 1, 4)), j) = True Then
       Exit Sub
      End If
   End If
   
   j = j + 1
    If InStr(ws.Cells(j, 1), "(") Then
     Exit Do
    End If
  Loop
  GoTo Nextline
  Exit Do
  End If
 End If
 
 If InStr(ws.Cells(i, 1), "KH") <> 0 Then
  Exit Sub
 End If
 
 i = i - 1
 Loop
 
 If i <= 2 Then
  Exit Sub
 End If
 
Nextline:
 intchk = CInt(Mid(strOUH, 2, 2))
 If IsNumeric(intchk) = False Then
 MsgBox "Error"
  Exit Sub
 End If
If intFrom = 1 Then
 Select Case intchk
 
  Case 30
   If CInt(Right(strOUH, 3)) = 300 Then
     SetH = "H300"
     setFH = 101
     setEH = 201
   Else
    setFH = 101
    SetH = "H301"
    setEH = 201
   End If
  Case 33
    setFH = 101
    SetH = "H331"
    setEH = 201
  Case 34
    setFH = 101
    SetH = "H341"
    setEH = 201
 End Select
 
ElseIf intFrom = 0 Then
Select Case intchk
 Case 30
   If CInt(Right(strOUH, 3)) = 300 Then
     SetH = "H300"
     setFH = 101
     setEH = 201
   Else
    setFH = 102
    SetH = "H302"
    setEH = 202
   End If
  Case 33
    setFH = 103
    SetH = "H333"
    setEH = 203
  Case 34
    setFH = 104
    SetH = "H344"
    setEH = 204
 End Select
End If


 For i = 0 To UBound(strSetH)
   j = strSetH(i)
   If ws.Cells(j - 1, 1) = "F200000" Then
    ws.Cells(j, 1) = ""
   Else
    ws.Cells(j, 1) = "FH" & setFH
   End If
  ' ws.Cells(j + 1, 1) = Left(ws.Cells(j + 1, 1), 5) & SetH
   ws.Cells(j + 1, 1) = "EH" & setEH & SetH
 Next i
 
 mchkOukiri = True
 
 Exit Sub
 
trap:
 
  Call ErrSyori("sSetOUKIRIvalue", Err.Description)
  
  
End Sub

Private Function fGetOUKakoH(ByVal lngStart As Long)

Dim ws As Worksheet
Dim i As Long
Dim strChk As String

i = lngStart
Set ws = ThisWorkbook.Worksheets(1)
Count = 0
On Error GoTo trap
Do While i < 20000
      If InStr(ws.Cells(i, 1), "FH") <> 0 And InStr(ws.Cells(i + 1, 1), "EH") <> 0 Then
       strChk = ws.Cells(i + 1, 1)
       Exit Do
      End If
    
  i = i + 1
  If InStr(ws.Cells(i, 1), "(") <> 0 Then
   Exit Do
  End If
 
Loop

fGetOUKakoH = Right(strChk, 4)

Exit Function

trap:
 
  Call ErrSyori("fGetOUKakoH", Err.Description)
  

End Function


Public Sub ErrSyori(ByVal strProcedure As String, ByVal strErrDesp As String)

    Dim objFs       As Object   'ƒtƒ@ƒCƒ‹ƒVƒXƒeƒ€ƒIƒuƒWƒFƒNƒg
    Dim strFileName As String   'ƒtƒ@ƒCƒ‹–¼
    Dim strErrPath As String
    
    MsgBox "ƒGƒ‰[‚ª”­¶‚µ‚Ü‚µ‚½B", vbExclamation

    Set objFs = CreateObject("Scripting.FileSystemObject") 'ƒtƒ@ƒCƒ‹ƒVƒXƒeƒ€ƒIƒuƒWƒFƒNƒgì¬

    'ƒtƒ@ƒCƒ‹–¼Žæ“¾
    strFileName = "ErrLog" & Format(Now, "YYYYMMDDHHMMSS") & ".txt"
    strErrPath = ActiveWorkbook.Path & "\" & "ErrLog"
    If Dir(strErrPath, vbDirectory) = "" Then
        MkDir strErrPath
    End If
    'ƒtƒ@ƒCƒ‹ì¬
'    Call objFs.CreateTextFile(cmstrSystemFolderPath & cmstrErrLogFolderName & "\" & strFileName)
    Call objFs.CreateTextFile(ActiveWorkbook.Path & "\" & "ErrLog" & "\" & strFileName)

    'ƒtƒ@ƒCƒ‹ƒI[ƒvƒ“
'    Open cmstrSystemFolderPath & cmstrErrLogFolderName & "\" & strFileName For Output As #1 Len = 32000
    Open ActiveWorkbook.Path & "\" & "ErrLog" & "\" & strFileName For Output As #1 Len = 32000

    '‘‚«ž‚Ý
    Print #1, "ƒvƒƒV[ƒWƒƒ["
    Print #1, strProcedure
    Print #1, "ƒGƒ‰[“à—e"
    Print #1, strErrDesp

    'ƒtƒ@ƒCƒ‹ƒNƒ[ƒY
    Close #1

    Set objFs = Nothing

End Sub


Private Function fChkG92(ByVal wsI As Long) As Boolean


Dim ws As Worksheet
Dim i As Long

 Set ws = ThisWorkbook.Worksheets(1)
 
 i = wsI
 
 Do While i > 2
  
  If InStr(ws.Cells(i, 1), "G92") <> 0 Then
   fChkG92 = True
   Exit Function
  End If
  
  i = i - 1
 Loop
 
 fChkG92 = False
 
End Function

Private Sub sSetSyokiIti(ByVal wsI As Long, ByVal WS2J As Long)

 Dim i As Long
 Dim ws As Worksheet
 Dim WS2 As Worksheet
 Dim chkG90 As Boolean
 
  Set ws = ThisWorkbook.Worksheets(3)
  Set WS2 = ThisWorkbook.Worksheets(1)
  
  i = wsI
  chkG90 = False
  Do While i < 10000
    
   If InStr(ws.Cells(i, 1), "G90") <> 0 Then
    chkG90 = True
    Exit Do
   End If
   
   i = i + 1
   If InStr(ws.Cells(i, 1), "(") <> 0 Then
    Exit Do
   End If
   
  Loop
  
  If chkG90 = False Then
   WS2.Cells(WS2J, 1) = "G90" & ws.Cells(wsI, 1)
  End If
  
End Sub

Private Function fchkSubProgram(ByVal strSubNo As String, ByVal lngStart As Long) As Boolean
 
  Dim ws As Worksheet
  Dim i As Long
  Dim chkM02 As Boolean
  Dim intSubNo As Integer
  Dim j As Long
  
  Set ws = ThisWorkbook.Worksheets(1)
    
  intSubNo = CInt(strSubNo)
  i = lngStart
  chkM02 = False
  Do While i <= 20000
   
   If InStr(ws.Cells(i, 1), "M02") <> 0 Then
    chkM02 = True
   End If
   
   If chkM02 = True And InStr(ws.Cells(i, 1), "N") <> 0 And (InStr(ws.Cells(i, 1), strSubNo) <> 0 Or InStr(ws.Cells(i, 1), intSubNo) <> 0) Then
    j = i
    
    Do While 1 = 1
     If InStr(ws.Cells(j, 1), "G04") <> 0 Then
      fchkSubProgram = True
      Exit Function
     End If
     
     If j >= 10000 Then
      fchkSubProgram = False
      Exit Function
     End If
    If InStr(ws.Cells(j, 1), "G23") <> 0 Then
     Exit Do
    End If
    
    j = j + 1
    Loop
    
     fchkSubProgram = False
     Exit Function
   End If
   
   i = i + 1
  Loop
  
End Function

Public Function fcheckJValue(ByVal strcheckJ As String) As Double
 
  Dim intcheckJ As Integer
  Dim strCheck As String
  
  intcheckJ = InStr(strcheckJ, "J")
  strCheck = Mid(strcheckJ, intcheckJ + 1, Len(strcheckJ) - intcheckJ)
  
  If intcheckJ <> Len(strcheckJ) And IsNumeric(strCheck) = True Then
    fcheckJValue = CDbl(strCheck)
  Else
   fcheckJValue = 0
  End If
  
End Function

Private Sub sSetPunch6th(ByVal lngSetLine As Long)

 Dim strThickness As String
 Dim ws As Worksheet
 Dim WS2 As Worksheet
 Dim i  As Long
 Dim intBlank As Integer
 Dim ArrayEpack(6)
 Dim ArrayF(6)
 Dim ArrayOffset(5)
 Dim intLCount As Integer
 Dim intSetArrayX As Integer
 Dim intSetArrayY As Integer
 
  strThickness = fSetThickness & "mm"
  i = 2
  intBlank = 0
  
  Set ws = ThisWorkbook.Worksheets(2)
  Set WS2 = ThisWorkbook.Worksheets(1)
  
   
  Do While i < 100
  
   If ws.Cells(i, 25) = strThickness Then
   
    Exit Do
   End If
    
    
   i = i + 10
  Loop
  
  intSetArrayX = 18
  intSetArrayY = i + 2
  
  For intLCount = 0 To 6
   ArrayEpack(intLCount) = ws.Cells(intSetArrayY + intLCount, intSetArrayX)
   ArrayF(intLCount) = ws.Cells(intSetArrayY + intLCount, intSetArrayX + 1)
   
    If intLCount <= 5 Then
    ArrayOffset(intLCount) = ws.Cells(intSetArrayY + intLCount + 1, intSetArrayX + 2)
    End If
   
  Next intLCount
  
 i = lngSetLine
 'Epack
 WS2.Cells(i, 1) = "H100=" & ArrayEpack(0)
 WS2.Cells(i + 1, 1) = "H101=" & ArrayEpack(1)
 WS2.Cells(i + 2, 1) = "H102=" & ArrayEpack(2)
 WS2.Cells(i + 3, 1) = "H103=" & ArrayEpack(3)
 WS2.Cells(i + 4, 1) = "H104=" & ArrayEpack(4)
 WS2.Cells(i + 5, 1) = "H105=" & ArrayEpack(5)
 WS2.Cells(i + 6, 1) = "H106=" & ArrayEpack(6)
 
 'F
 WS2.Cells(i + 8, 1) = "H200=" & Format(ArrayF(0), "0.0")
 WS2.Cells(i + 9, 1) = "H201=" & Format(ArrayF(1), "0.0")
 WS2.Cells(i + 10, 1) = "H202=" & Format(ArrayF(2), "0.0")
 WS2.Cells(i + 11, 1) = "H203=" & Format(ArrayF(3), "0.0")
 WS2.Cells(i + 12, 1) = "H204=" & Format(ArrayF(4), "0.0")
 WS2.Cells(i + 13, 1) = "H205=" & Format(ArrayF(5), "0.0")
 WS2.Cells(i + 14, 1) = "H206=" & Format(ArrayF(6), "0.0")
 'Offset
 WS2.Cells(i + 16, 1) = "H301=" & Format(ArrayOffset(0), "0.000")
 WS2.Cells(i + 17, 1) = "H302=" & Format(ArrayOffset(1), "0.000")
 WS2.Cells(i + 18, 1) = "H303=" & Format(ArrayOffset(2), "0.000")
 WS2.Cells(i + 19, 1) = "H304=" & Format(ArrayOffset(3), "0.000")
 WS2.Cells(i + 20, 1) = "H305=" & Format(ArrayOffset(4), "0.000")
 WS2.Cells(i + 21, 1) = "H306=" & Format(ArrayOffset(5), "0.000")
 
End Sub
