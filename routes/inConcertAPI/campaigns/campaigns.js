var router = require("express").Router();
var sql = require("mssql");
var os = require("os");
var moment = require("moment");
var constants = require("../../../constants");
var utils = require("../../../utils.js");
var fetch = require("node-fetch");
var exjwt = require("express-jwt");
var json2html = require("node-json2html");

const e = require("express");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

const GetCampaigns = async (url, date) => {
  const interactions = [];

  try {
    let i = 1;
    while (url) {
      const response = await await fetch(url + "/" + i, {
        headers: {
          "x-api-key": "c9a6dae22a293af4ead2a0ef9392e271",
        },
      });

      if ((await response.status) !== 200) {
        throw new Error("HTTP error " + (await response.status));
      }

      const res = await response.json();

      interactions.push(res.items);
      i = i + 1;

      res.items.length === 2000 ? (url = url) : (url = null);
    }
  } catch (e) {
    console.log(e);
  }

  var data = sql
    .connect(constants.dbCluster)
    .then(() => {
      const table = new sql.Table("inConcert.dbo.Interacciones");
      table.create = false;

      table.columns.add("Id", sql.VarChar(255), { nullable: true });
      table.columns.add("VirtualCC", sql.VarChar(255), { nullable: true });
      table.columns.add("Type", sql.VarChar(255), { nullable: true });
      table.columns.add("StartDate", sql.DateTime, { nullable: true });
      table.columns.add("StartDateUTC", sql.DateTime, { nullable: true });
      table.columns.add("EndDate", sql.DateTime, { nullable: true });
      table.columns.add("EndDateUTC", sql.DateTime, { nullable: true });
      table.columns.add("Campaign", sql.VarChar(255), { nullable: true });
      table.columns.add("Direction", sql.VarChar(255), { nullable: true });
      table.columns.add("Sections", sql.Float, { nullable: true });
      table.columns.add("IsTaked", sql.Bit, { nullable: true });
      table.columns.add("IsAbandoned", sql.Bit, { nullable: true });
      table.columns.add("IsCancelled", sql.Bit, { nullable: true });
      table.columns.add("IsInBoundAttended", sql.Bit, { nullable: true });
      table.columns.add("IsOutBoundAttended", sql.Bit, { nullable: true });
      table.columns.add("IsInBoundAbandoned", sql.Bit, { nullable: true });
      table.columns.add("IsOutBoundAbandoned", sql.Bit, { nullable: true });
      table.columns.add("IsInBoundCancelled", sql.Bit, { nullable: true });
      table.columns.add("IsOutBoundCancelled", sql.Bit, { nullable: true });
      table.columns.add("IsTransferred", sql.Bit, { nullable: true });
      table.columns.add("TransferType", sql.VarChar(255), { nullable: true });
      table.columns.add("TransferResult", sql.VarChar(255), { nullable: true });
      table.columns.add("NumberOfTransferred", sql.VarChar(255), {
        nullable: true,
      });
      table.columns.add("IsConferenced", sql.Bit, { nullable: true });
      table.columns.add("NumbersOfConferenced", sql.VarChar(255), {
        nullable: true,
      });
      table.columns.add("IsCallBack", sql.Bit, { nullable: true });
      table.columns.add("HasCallBack", sql.Bit, { nullable: true });
      table.columns.add("HasVoiceMail", sql.Bit, { nullable: true });
      table.columns.add("SLPossitive", sql.Bit, { nullable: true });
      table.columns.add("TimeStamp", sql.DateTime, { nullable: true });
      table.columns.add("TimeStampUTC", sql.DateTime, { nullable: true });
      table.columns.add("DurationTime", sql.Float, { nullable: true });
      table.columns.add("AnswerTime", sql.Float, { nullable: true });
      table.columns.add("WaitTime", sql.Float, { nullable: true });
      table.columns.add("ControlAgentTime", sql.Float, { nullable: true });
      table.columns.add("IVRTime", sql.Float, { nullable: true });
      table.columns.add("AttentionTime", sql.Float, { nullable: true });
      table.columns.add("WrapupTime", sql.Float, { nullable: true });
      table.columns.add("DesertionTime", sql.Float, { nullable: true });
      table.columns.add("HoldTime", sql.Float, { nullable: true });
      table.columns.add("TransferTime", sql.Float, { nullable: true });
      table.columns.add("RequeuedTime", sql.Float, { nullable: true });
      table.columns.add("RingingTime", sql.Float, { nullable: true });
      table.columns.add("RingBackTime", sql.Float, { nullable: true });
      table.columns.add("OutOfHour", sql.Bit, { nullable: true });
      table.columns.add("Shift", sql.VarChar(255), { nullable: true });
      table.columns.add("Process", sql.VarChar(255), { nullable: true });
      table.columns.add("TotalHolds", sql.Float, { nullable: true });
      table.columns.add("IsShortCallThreshold", sql.Bit, { nullable: true });
      table.columns.add("IsLongCallThreshold", sql.Bit, { nullable: true });
      table.columns.add("IsGhostCallThresHold", sql.Bit, { nullable: true });
      table.columns.add("IsIVR", sql.Bit, { nullable: true });
      table.columns.add("IsSentToAgentSearch", sql.Bit, { nullable: true });
      table.columns.add("TrunkId", sql.VarChar(255), { nullable: true });
      table.columns.add("TrunkType", sql.VarChar(255), { nullable: true });
      table.columns.add("Prefix", sql.VarChar(255), { nullable: true });
      table.columns.add("OriginalCampaign", sql.VarChar(255), {
        nullable: true,
      });
      table.columns.add("ForwardProcess", sql.VarChar(255), { nullable: true });
      table.columns.add("RedialProcess", sql.VarChar(255), { nullable: true });
      table.columns.add("StartAttentionTime", sql.DateTime, { nullable: true });
      table.columns.add("StartAttentionTimeUTC", sql.DateTime, {
        nullable: true,
      });
      table.columns.add("Disposition", sql.VarChar(255), { nullable: true });
      table.columns.add("ContactId", sql.VarChar(255), { nullable: true });
      table.columns.add("ContactName", sql.VarChar(255), { nullable: true });
      table.columns.add("ContactAddress", sql.VarChar(255), { nullable: true });
      table.columns.add("ManagementResult", sql.VarChar(255), {
        nullable: true,
      });
      table.columns.add("IsGoalManagementResult", sql.Bit, { nullable: true });
      table.columns.add("Completed", sql.Bit, { nullable: true });
      table.columns.add("FirstAgent", sql.VarChar(255), { nullable: true });
      table.columns.add("LastAgent", sql.VarChar(255), { nullable: true });
      table.columns.add("TotalAgents", sql.Float, { nullable: true });
      table.columns.add("Slice", sql.Float, { nullable: true });
      table.columns.add("WorkitemType", sql.VarChar(255), { nullable: true });
      table.columns.add("BatchId", sql.VarChar(255), { nullable: true });
      table.columns.add("OutboundProcessId", sql.VarChar(255), {
        nullable: true,
      });
      table.columns.add("IsUseful", sql.Bit, { nullable: true });
      table.columns.add("PreviewTime", sql.Float, { nullable: true });
      table.columns.add("Section", sql.Float, { nullable: true });
      table.columns.add("Actor", sql.VarChar(255), { nullable: true });
      table.columns.add("ActorName", sql.VarChar(255), { nullable: true });
      table.columns.add("Part", sql.Float, { nullable: true });
      table.columns.add("PreferredCampaign", sql.VarChar(255), {
        nullable: true,
      });
      table.columns.add("FirstAtteActor", sql.VarChar(255), { nullable: true });
      table.columns.add("SourceHangup", sql.VarChar(255), { nullable: true });

      interactions[0].forEach((arr) => {
        table.rows.add(
          arr.Id,
          arr.VirtualCC,
          arr.Type,
          parseDate(arr.StartDate),
          parseDate(arr.StartDateUTC),
          parseDate(arr.EndDate),
          parseDate(arr.EndDateUTC),
          arr.Campaign,
          arr.Direction,
          arr.Sections,
          arr.IsTaked,
          arr.IsAbandoned,
          arr.IsCancelled,
          arr.IsInBoundAttended,
          arr.IsOutBoundAttended,
          arr.IsInBoundAbandoned,
          arr.IsOutBoundAbandoned,
          arr.IsInBoundCancelled,
          arr.IsOutBoundCancelled,
          arr.IsTransferred,
          arr.TransferType,
          arr.TransferResult,
          arr.NumberOfTransferred,
          arr.IsConferenced,
          arr.NumbersOfConferenced,
          arr.IsCallBack,
          arr.HasCallBack,
          arr.HasVoiceMail,
          arr.SLPossitive,
          parseDate(arr.TimeStamp),
          parseDate(arr.TimeStampUTC),
          arr.DurationTime,
          arr.AnswerTime,
          arr.WaitTime,
          arr.ControlAgentTime,
          arr.IVRTime,
          arr.AttentionTime,
          arr.WrapupTime,
          arr.DesertionTime,
          arr.HoldTime,
          arr.TransferTime,
          arr.RequeuedTime,
          arr.RingingTime,
          arr.RingBackTime,
          arr.OutOfHour,
          arr.Shift,
          arr.Process,
          arr.TotalHolds,
          arr.IsShortCallThreshold,
          arr.IsLongCallThreshold,
          arr.IsGhostCallThresHold,
          arr.IsIVR,
          arr.IsSentToAgentSearch,
          arr.TrunkId,
          arr.TrunkType,
          arr.Prefix,
          arr.OriginalCampaign,
          arr.ForwardProcess,
          arr.RedialProcess,
          parseDate(arr.StartAttentionTime),
          parseDate(arr.StartAttentionTimeUTC),
          arr.Disposition,
          arr.ContactId,
          arr.ContactName,
          arr.ContactAddress,
          arr.ManagementResult,
          arr.IsGoalManagementResult,
          arr.Completed,
          arr.FirstAgent,
          arr.LastAgent,
          arr.TotalAgents,
          arr.Slice,
          arr.WorkitemType,
          arr.BatchId,
          arr.OutboundProcessId,
          arr.IsUseful,
          arr.PreviewTime,
          arr.Section,
          arr.Actor,
          arr.ActorName,
          arr.Part,
          arr.PreferredCampaign,
          arr.FirstAtteActor,
          arr.SourceHangup
        );
      });

      const request = new sql.Request();
      return request.bulk(table);
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });

  var inserted = { inserted: await data };

  return inserted;
};

function parseDate(input) {
  return new Date(
    moment
      .utc(input, "DD/MM/YYYY HH:mm:ss")
      .subtract(5, "hours")
      .format("YYYY-MM-DD HH:mm:ss")
  );
}

router.get("/Insertar", async (req, res) => {
  var x = await GetCampaigns(
    "https://wscls25.inconcertcc.com/Data/api/ccs/Interactions/Phone/" +
      moment.utc(new Date(req.query.fecha)).format("YYYY-MM-DD") +
      "/"
  );

  res.send(x);
});

router.get("/AcumuladoresCampanias", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("INTERVALO", req.query.intervalo);
    request.input("CAMPAIGN", req.query.campaign);
    request.input("FECHA_INI", req.query.fecha_ini);
    request.input("FECHA_FIN", req.query.fecha_fin);
    request.query(
      `EXEC inConcert.dbo.AcumuladoresCampania @INTERVALO = @INTERVALO ,@CAMPAIGN = @CAMPAIGN,@FECHA_INI = @FECHA_INI,@FECHA_FIN = @FECHA_FIN`,
      (err, recordset) => {
        if (err) console.log(err);
        let template = { "<>": "div", html: '${Campaign} ${Date} ${Ate<5"} ${Ate<10"} ${Ate<15"} ${Ate<20"} ${Aba<5"} ${Aba<10"} ${Aba<15"} ${Aba<20"} ${Atendidas} ${Abandonadas} ${ATT} ${ASA} ${AAT}'};
        let html = json2html.transform(recordset, template);

        res.send(html);
      }
    );
  });
});

router.get("/Test", (req, res) => {
  res.send({ Test: "ok" });
});

module.exports = router;
