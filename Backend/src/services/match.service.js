import Match from "../models/match.model.js";

import Group from "../models/group.model.js";

import { ApiError }
    from "../utils/ApiError.js";

import {
    withTransaction,
}
    from "../utils/withTransaction.js";


const updateMatchResultsService =
    async ({
        matchId,
        results,
    }) => {

        return await withTransaction(
            async (session) => {

                const match =
                    await Match.findById(
                        matchId
                    )
                        .populate("teams")
                        .populate("group")
                        .session(session);

                if (!match) {

                    throw new ApiError(
                        404,
                        "Match not found"
                    );

                }

                if (
                    match.group
                        ?.qualificationLocked
                ) {

                    throw new ApiError(
                        400,
                        "Cannot edit results after qualification is locked"
                    );

                }

                if (
                    !results ||
                    !Array.isArray(results) ||
                    results.length === 0
                ) {

                    throw new ApiError(
                        400,
                        "Results are required"
                    );

                }

                const submittedTeams =
                    new Set();

                results.forEach((result) => {

                    if (!result.team) {

                        throw new ApiError(
                            400,
                            "Team is required"
                        );

                    }

                    if (
                        submittedTeams.has(
                            result.team.toString()
                        )
                    ) {

                        throw new ApiError(
                            400,
                            "Duplicate teams found in results"
                        );

                    }

                    submittedTeams.add(
                        result.team.toString()
                    );

                    const teamExists =
                        match.teams.some(
                            (team) =>
                                team._id.toString() ===
                                result.team.toString()
                        );

                    if (!teamExists) {

                        throw new ApiError(
                            400,
                            "Invalid team in results"
                        );

                    }

                    if (result.kills < 0) {

                        throw new ApiError(
                            400,
                            "Kills cannot be negative"
                        );

                    }

                    if (
                        result.placementPoints < 0
                    ) {

                        throw new ApiError(
                            400,
                            "Placement points cannot be negative"
                        );

                    }

                    result.totalPoints =
                        result.placementPoints +
                        result.kills;

                });

                match.results =
                    results;

                match.status =
                    "completed";

                await match.save({
                    session
                });

                return match;

            }
        );

    };

const createMatchService =
   async ({
      tournamentId,
      roundId,
      groupId,
      matchNumber,
      map,
      scheduledAt,
   }) => {

      return await withTransaction(
         async (session) => {

            if (
               !tournamentId ||
               !roundId ||
               !groupId ||
               !matchNumber ||
               !map ||
               !scheduledAt
            ) {

               throw new ApiError(
                  400,
                  "All required fields must be provided"
               );

            }

            const group =
               await Group.findById(
                  groupId
               )
                  .populate("teams")
                  .session(session);

            if (!group) {

               throw new ApiError(
                  404,
                  "Group not found"
               );

            }

            const existingMatch =
               await Match.findOne({

                  group: groupId,

                  matchNumber,

               }).session(session);

            if (existingMatch) {

               throw new ApiError(
                  400,
                  "Match already exists"
               );

            }

            const createdMatches =
               await Match.create(
                  [
                     {
                        tournament:
                           tournamentId,

                        round:
                           roundId,

                        group:
                           groupId,

                        name:
                           `Match ${matchNumber}`,

                        matchNumber,

                        map,

                        scheduledAt,

                        teams:
                           group.teams.map(
                              (team) =>
                                 team._id
                           ),
                     },
                  ],
                  {
                     session
                  }
               );

            return createdMatches[0];

         }
      );

   };


   
export {
   createMatchService,
   updateMatchResultsService,
};