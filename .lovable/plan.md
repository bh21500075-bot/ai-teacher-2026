

## Fix Bachelor's Program Abbreviations

Update the `bachelorPrograms` array in `src/pages/guest/ProgramsInfo.tsx` to use correct abbreviations:

| Current | Correct |
|---------|---------|
| BSInfE | BSIE |
| BSMecE | BSME |
| BSEnvE | BSEnE |

**Change lines 7-9** in the bachelorPrograms array:

```typescript
// Line 7: Change BSInfE → BSIE
{ name: 'Informatics Engineering', abbr: 'BSIE', college: 'Engineering', ... }

// Line 8: Change BSMecE → BSME  
{ name: 'Mechatronics Engineering', abbr: 'BSME', college: 'Engineering', ... }

// Line 9: Change BSEnvE → BSEnE
{ name: 'Environmental Engineering', abbr: 'BSEnE', college: 'Engineering', ... }
```

This aligns the guest-facing program abbreviations with the standardized codes used throughout the database and other parts of the application.

